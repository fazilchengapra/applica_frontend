import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RealtimeEvent {
  id: string;
  receivedAt: string;
  type: string;
  payload: unknown;
}

export function isCvRealtimeEvent(event: RealtimeEvent | null) {
  if (!event) return false;
  const type = event.type.toLowerCase();
  return type.includes("cv") || type.includes("resume") || type.includes("master_cv");
}

interface NotificationState {
  connection: "connecting" | "open" | "closed";
  events: RealtimeEvent[];
  unreadCount: number;
  lastEvent: RealtimeEvent | null;
}

const initialState: NotificationState = {
  connection: "closed",
  events: [],
  unreadCount: 0,
  lastEvent: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setConnection: (
      state,
      action: PayloadAction<NotificationState["connection"]>,
    ) => {
      state.connection = action.payload;
    },
    receiveEvent: (state, action: PayloadAction<RealtimeEvent>) => {
      state.lastEvent = action.payload;
      state.events.unshift(action.payload);
      state.events = state.events.slice(0, 50);
      state.unreadCount += 1;
    },
    markAllRead: (state) => {
      state.unreadCount = 0;
    },
    resetNotifications: () => initialState,
  },
});

export const {
  setConnection,
  receiveEvent,
  markAllRead,
  resetNotifications,
} = notificationSlice.actions;
export default notificationSlice.reducer;