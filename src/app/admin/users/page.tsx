"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Search,
  UserPlus,
  RefreshCw,
  AlertCircle,
  Ban,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import api from "@/lib/axios";
import UserDetailsModal from "@/components/admin/UserDetailsModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  phone_number?: string | null;
  is_staff?: boolean;
  is_superuser?: boolean;
  email_verified?: boolean;
  phone_verified?: boolean;
  first_name?: string | null;
  last_name?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  country?: string | null;
  city?: string | null;
  timezone?: string | null;
  locale?: string | null;
  auth_methods?: Array<{
    provider: string;
    provider_email?: string | null;
    verification_status?: boolean | string | null;
    is_verified?: boolean | null;
    active_status?: boolean | string | null;
    is_active?: boolean | null;
    linked_date?: string | null;
    linked_at?: string | null;
    last_used?: string | null;
    last_used_at?: string | null;
  }>;
  verification_tokens?: Array<{
    type: string;
    status: "used" | "active" | "expired" | "revoked";
    created_at: string;
    expires_at: string;
  }>;
  notifications?: Array<{
    id: number;
    type: string;
    title: string;
    message: string;
    status: "Read" | "Unread";
    created_at: string;
    read_at?: string | null;
    metadata?: Record<string, unknown>;
  }>;
  activity_summary?: {
    notifications_count: number;
    unread_notifications_count: number;
  };
  master_cvs?: {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
  };
  cv_versions?: Array<{
    version: string;
    target_role: string;
    status: string;
    is_current: boolean;
    created_at: string;
    raw_text?: string | null;
    parsed_data?: unknown;
  }>;
  date_joined?: string | null;
  last_login?: string | null;
  updated_at?: string | null;
  deactivated_at?: string | null;
}

interface PaginatedUsers {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
  "bg-orange-100 text-orange-700",
  "bg-indigo-100 text-indigo-700",
];

function getInitials(username: string): string {
  const parts = username.trim().split(/[\s_\-\.]+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return username.slice(0, 2).toUpperCase();
}

function getAvatarColor(id: number): string {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

// ─── Build URL with search param ──────────────────────────────────────────────

function buildUrl(search: string): string {
  const base = "v1/users/";
  if (!search.trim()) return base;
  return `${base}?search=${encodeURIComponent(search.trim())}`;
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-surface-container" />
          <div className="space-y-1.5">
            <div className="h-3 w-32 rounded bg-surface-container" />
            <div className="h-2.5 w-44 rounded bg-surface-container" />
          </div>
        </div>
      </td>
      <td className="hidden px-6 py-4 sm:table-cell">
        <div className="h-3 w-8 rounded bg-surface-container" />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-surface-container" />
          <div className="space-y-1.5">
            <div className="h-3 w-32 rounded bg-surface-container" />
            <div className="h-2.5 w-44 rounded bg-surface-container" />
          </div>
        </div>
      </td>
      <td className="hidden px-6 py-4 md:table-cell">
        <div className="h-5 w-16 rounded-full bg-surface-container" />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="ml-auto h-7 w-20 rounded bg-surface-container" />
      </td>
    </tr>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [data, setData] = useState<PaginatedUsers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [pageUrl, setPageUrl] = useState("v1/users/");
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchUsers = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<PaginatedUsers>(url);
      setData(res.data);
    } catch {
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and whenever pageUrl changes (pagination)
  useEffect(() => {
    void Promise.resolve().then(() => fetchUsers(pageUrl));
  }, [fetchUsers, pageUrl]);

  // Debounced server-side search — fires 400ms after user stops typing
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setPageUrl(buildUrl(search));
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const users = data?.results ?? [];

  const handlePrev = () => {
    if (data?.previous) {
      // Extract relative path from absolute URL
      const url = data.previous.replace(/^https?:\/\/[^/]+\/api\//, "");
      setPageUrl(url);
    }
  };

  const handleNext = () => {
    if (data?.next) {
      const url = data.next.replace(/^https?:\/\/[^/]+\/api\//, "");
      setPageUrl(url);
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    setUpdatingUserId(user.id);
    setError(null);

    try {
      await api.patch(`v1/users/admin/${user.id}/toggle-active/`, {
        is_active: !user.is_active,
      });
      await fetchUsers(pageUrl);
    } catch {
      setError(`Failed to ${user.is_active ? "block" : "unblock"} ${user.username}. Please try again.`);
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <main className="flex-grow bg-background p-container-padding">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
              Management
            </p>
            <h2 className="mt-2 font-display-lg text-display-lg text-on-background">
              Users
            </h2>
            <p className="mt-2 text-sm text-secondary">
              Browse, manage, and moderate all registered accounts.
              {data && (
                <span className="ml-1 font-semibold text-on-background">
                  ({data.count} total)
                </span>
              )}
            </p>
          </div>
          <button className="flex items-center gap-2 self-start rounded-lg bg-primary px-4 py-3 text-sm font-bold text-on-primary transition-colors hover:bg-primary-container md:self-auto">
            <UserPlus className="h-4 w-4" />
            Add user
          </button>
        </header>

        {/* ── Search bar ──────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or ID…"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pl-9 pr-4 text-sm text-on-background placeholder:text-secondary focus:border-primary focus:outline-none"
            />
          </div>
          <button
            onClick={() => fetchUsers(pageUrl)}
            className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm text-secondary transition-colors hover:bg-surface-container"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* ── Error state ─────────────────────────────────────────────────── */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-error/20 bg-error/5 px-5 py-4 text-sm text-error">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => fetchUsers(pageUrl)}
              className="ml-auto font-semibold underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Table ───────────────────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>
                <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-secondary sm:table-cell">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-secondary">
                  User
                </th>
                <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-secondary md:table-cell">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-secondary">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-outline-variant">
              {/* Loading skeletons */}
              {loading &&
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

              {/* Data rows */}
              {!loading &&
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-surface-container-low"
                  >
                    {/* ID */}
                    <td className="hidden px-6 py-4 sm:table-cell">
                      <span className="rounded-md bg-surface-container px-2 py-0.5 text-xs font-mono font-semibold text-secondary">
                        #{user.id}
                      </span>
                    </td>

                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(user.id)}`}
                        >
                          {getInitials(user.username)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-on-background">
                            {user.username}
                          </p>
                          <p className="truncate text-xs text-secondary">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="hidden px-6 py-4 md:table-cell">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            user.is_active ? "bg-emerald-500" : "bg-outline"
                          }`}
                        />
                        <span className="text-secondary">
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                        >
                          View
                        </button>
                        <button className="rounded-md px-3 py-1.5 text-xs font-medium text-secondary transition-colors hover:bg-surface-container">
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleUserStatus(user)}
                          disabled={updatingUserId === user.id}
                          title={user.is_active ? "Block user" : "Unblock user"}
                          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-wait disabled:opacity-50 ${
                            user.is_active
                              ? "text-error hover:bg-error/10"
                              : "text-emerald-700 hover:bg-emerald-50"
                          }`}
                        >
                          {updatingUserId === user.id ? (
                            <>
                              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              {user.is_active ? (
                                <Ban className="h-3.5 w-3.5" />
                              ) : (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              )}
                              {user.is_active ? "Block" : "Unblock"}
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {/* Empty state */}
              {!loading && !error && users.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <p className="text-sm font-semibold text-on-background">
                      No users found
                    </p>
                    <p className="mt-1 text-xs text-secondary">
                      {search ? "Try a different search term." : "No accounts have been created yet."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-outline-variant px-6 py-4">
            <p className="text-xs text-secondary">
              {data ? (
                <>
                  Showing{" "}
                  <span className="font-semibold text-on-background">
                    {users.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-on-background">
                    {data.count}
                  </span>{" "}
                  users
                </>
              ) : (
                "Loading…"
              )}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={!data?.previous || loading}
                className="rounded-md border border-outline-variant px-3 py-1.5 text-xs text-secondary transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={!data?.next || loading}
                className="rounded-md border border-outline-variant px-3 py-1.5 text-xs text-secondary transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <UserDetailsModal
        key={selectedUser?.id ?? "closed"}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </main>
  );
}
