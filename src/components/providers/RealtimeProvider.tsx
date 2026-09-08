"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import api from "@/lib/axios";
import {
  receiveEvent,
  resetNotifications,
  setConnection,
} from "@/store/slices/notificationSlice";

const websocketUrl =
  process.env.NEXT_PUBLIC_NOTIFICATIONS_WS_URL ??
  "ws://127.0.0.1:8000/ws/notifications/";

function getEventType(payload: unknown) {
  if (!payload || typeof payload !== "object") return "message";

  const message = payload as Record<string, unknown>;
  const eventType =
    message.type ?? message.event ?? message.event_type ?? message.action;
  return typeof eventType === "string" ? eventType : "message";
}

export default function RealtimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(resetNotifications());
      return;
    }

    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let socket: WebSocket | undefined;
    let disposed = false;

    const connect = async () => {
      if (disposed) return;

      dispatch(setConnection("connecting"));

      try {
        const response = await api.post<{ access_token?: string }>(
          "v1/auth/token/refresh/",
        );
        const accessToken = response.data?.access_token;

        if (!accessToken) {
          if (!disposed) dispatch(setConnection("closed"));
          return;
        }

        const separator = websocketUrl.includes("?") ? "&" : "?";
        socket = new WebSocket(
          `${websocketUrl}${separator}access_token=${encodeURIComponent(accessToken)}`,
        );
      } catch {
        if (!disposed) dispatch(setConnection("closed"));
        return;
      }

      if (disposed) return;

      socket.onopen = () => {
        dispatch(setConnection("open"));
      };

      socket.onmessage = (message) => {
        try {
          const payload: unknown = JSON.parse(message.data);
          dispatch(
            receiveEvent({
              id: `${Date.now()}-${Math.random()}`,
              receivedAt: new Date().toISOString(),
              type: getEventType(payload),
              payload,
            }),
          );
        } catch {
          dispatch(
            receiveEvent({
              id: `${Date.now()}-${Math.random()}`,
              receivedAt: new Date().toISOString(),
              type: "message",
              payload: message.data,
            }),
          );
        }
      };

      socket.onclose = () => {
        if (disposed) return;
        dispatch(setConnection("closed"));
        reconnectTimer = setTimeout(connect, 3000);
      };

      socket.onerror = () => {
        socket?.close();
      };
    };

    connect();

    return () => {
      disposed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
      dispatch(setConnection("closed"));
    };
  }, [dispatch, isAuthenticated]);

  return children;
}