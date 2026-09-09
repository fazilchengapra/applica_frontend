"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  CircleUserRound,
  Clock3,
  Download,
  Eye,
  FileText,
  LockKeyhole,
  Mail,
  ShieldCheck,
  TriangleAlert,
  X,
} from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";

interface OverviewResponse {
  id: number;
  contact: {
    email: string;
    phone_number: string | null;
  };
  account: {
    status: string;
    is_active: boolean;
    is_deactivated: boolean;
    deactivated_at: string | null;
  };
  permissions: {
    is_staff: boolean;
    is_superuser: boolean;
  };
  verification: {
    email_verified: boolean;
    phone_verified: boolean;
  };
  timestamps: {
    joined_at: string | null;
    last_login: string | null;
    last_updated: string | null;
  };
}

interface ProfileResponse {
  name: {
    first_name: string | null;
    last_name: string | null;
    display_name: string | null;
  };
  profile: {
    avatar_url: string | null;
    bio: string | null;
  };
  personal: {
    date_of_birth: string | null;
    gender: string | null;
  };
  location: {
    country: string | null;
    city: string | null;
    timezone: string | null;
  };
  locale: string | null;
}

interface VerificationHistoryPage {
  count: number;
  next: string | null;
  previous: string | null;
  results: VerificationToken[];
}

interface AuthenticationResponse {
  authentication_methods: Array<{
    provider: string;
    provider_email: string | null;
    verification: {
      is_verified: boolean;
    };
    status: {
      is_active: boolean;
    };
    linked_at: string | null;
    last_used_at: string | null;
  }>;
  verification_history?: VerificationHistoryPage | VerificationToken[];
}

interface AuthMethod {
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
}

interface VerificationToken {
  type: string;
  status: "used" | "active" | "expired" | "revoked";
  created_at: string;
  expires_at: string;
}

function normalizeVerificationHistory(
  payload: AuthenticationResponse | VerificationHistoryPage | VerificationToken[],
): VerificationHistoryPage {
  const history = "verification_history" in payload ? payload.verification_history : payload;

  if (Array.isArray(history)) {
    return {
      count: history.length,
      next: null,
      previous: null,
      results: history,
    };
  }

  return history ?? { count: 0, next: null, previous: null, results: [] };
}

interface MasterCv {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

interface CvVersion {
  version: string;
  target_role: string;
  status: string;
  is_current: boolean;
  created_at: string;
  raw_text?: string | null;
  parsed_data?: unknown;
}

interface UserNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  status: "Read" | "Unread";
  created_at: string;
  read_at?: string | null;
  metadata?: Record<string, unknown>;
}

interface ActivitySummary {
  notifications_count: number;
  unread_notifications_count: number;
}

const DEMO_MASTER_CV: MasterCv = {
  id: 1,
  created_at: "2026-09-01",
  updated_at: "2026-09-08",
  deleted_at: null,
};

const DEMO_CV_VERSIONS: CvVersion[] = [
  { version: "V3", target_role: "Backend Engineer", status: "Completed", is_current: true, created_at: "2026-09-08" },
  { version: "V2", target_role: "Python Developer", status: "Completed", is_current: false, created_at: "2026-09-05" },
  { version: "V1", target_role: "Software Engineer", status: "Completed", is_current: false, created_at: "2026-09-01" },
];

const DEMO_NOTIFICATIONS: UserNotification[] = [
  {
    id: 1,
    type: "account.password_changed",
    title: "Password Changed",
    message: "Your password was successfully changed.",
    status: "Read",
    created_at: "2026-09-08",
    read_at: "2026-09-08",
    metadata: { channel: "email", source: "account_security" },
  },
  {
    id: 2,
    type: "cv.processing",
    title: "CV Ready",
    message: "Your CV has finished processing and is ready to review.",
    status: "Unread",
    created_at: "2026-09-07",
    metadata: { cv_version: "V3", processing_time_ms: 1840 },
  },
  {
    id: 3,
    type: "account.welcome",
    title: "Welcome",
    message: "Welcome to Applica. Your account is ready to use.",
    status: "Read",
    created_at: "2026-09-01",
    read_at: "2026-09-01",
    metadata: { campaign: "onboarding", channel: "in_app" },
  },
];

interface UserDetailsModalProps {
  user: {
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
    auth_methods?: AuthMethod[];
    verification_tokens?: VerificationToken[];
    notifications?: UserNotification[];
    activity_summary?: ActivitySummary;
    master_cvs?: MasterCv;
    cv_versions?: CvVersion[];
    date_joined?: string | null;
    last_login?: string | null;
    updated_at?: string | null;
    deactivated_at?: string | null;
  } | null;
  onClose: () => void;
}

const tabs = [
  { label: "Overview", icon: CircleUserRound },
  { label: "Profile", icon: BriefcaseBusiness },
  { label: "Authentication & Security", icon: LockKeyhole },
  { label: "CVs", icon: FileText },
  { label: "Notifications", icon: Bell },
  { label: "Activity", icon: Activity },
];

const TAB_ENDPOINTS: Record<string, string> = {
  Overview: "overview",
  CVs: "cvs",
  Notifications: "notifications",
  Activity: "activity",
};

function formatDate(value?: string | null): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatBoolean(value?: boolean): string {
  if (typeof value !== "boolean") return "—";
  return value ? "Yes" : "No";
}

function formatShortDate(value?: string | null): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-outline-variant/70 py-3.5 last:border-b-0">
      <dt className="text-xs font-medium text-secondary">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-on-background">{value}</dd>
    </div>
  );
}

function OverviewContent({ user }: { user: NonNullable<UserDetailsModalProps["user"]> }) {
  return (
    <div className="space-y-8">
      <section>
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-on-background">Account Information</h4>
            <p className="mt-1 text-xs text-secondary">Identity, access, and verification status.</p>
          </div>
          <CircleUserRound className="h-5 w-5 text-primary" />
        </div>
        <dl className="grid grid-cols-1 divide-y divide-outline-variant/70 rounded-xl border border-outline-variant bg-surface-container-low px-4 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:px-5">
          <div className="sm:pr-5">
            <DetailItem label="User ID" value={`#${user.id}`} />
            <DetailItem label="Email" value={user.email || "—"} />
            <DetailItem label="Phone Number" value={user.phone_number || "—"} />
            <DetailItem label="Account Status" value={user.is_active ? "Active" : "Inactive"} />
          </div>
          <div className="sm:pl-5">
            <DetailItem label="Staff Access" value={formatBoolean(user.is_staff)} />
            <DetailItem label="Superuser" value={formatBoolean(user.is_superuser)} />
            <DetailItem label="Email Verified" value={formatBoolean(user.email_verified)} />
            <DetailItem label="Phone Verified" value={formatBoolean(user.phone_verified)} />
          </div>
        </dl>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-on-background">Account Timeline</h4>
            <p className="mt-1 text-xs text-secondary">Important account events and timestamps.</p>
          </div>
          <Activity className="h-5 w-5 text-primary" />
        </div>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            ["Joined", formatDate(user.date_joined)],
            ["Last Login", formatDate(user.last_login)],
            ["Last Updated", formatDate(user.updated_at)],
            ["Deactivated At", formatDate(user.deactivated_at)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3.5">
              <dt className="text-xs font-medium text-secondary">{label}</dt>
              <dd className="mt-1 text-sm font-semibold text-on-background">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function ProfileContent({ user }: { user: NonNullable<UserDetailsModalProps["user"]> }) {
  const displayName = user.display_name || [user.first_name, user.last_name].filter(Boolean).join(" ") || "—";
  const hasAvatar = Boolean(user.avatar_url);

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-3">
          <h4 className="text-base font-bold text-on-background">Personal Information</h4>
          <p className="mt-1 text-xs text-secondary">The user&apos;s personal profile details.</p>
        </div>
        <dl className="grid grid-cols-1 divide-y divide-outline-variant/70 rounded-xl border border-outline-variant bg-surface-container-low px-4 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:px-5">
          <div className="sm:pr-5">
            <DetailItem label="First Name" value={user.first_name || "—"} />
            <DetailItem label="Last Name" value={user.last_name || "—"} />
          </div>
          <div className="sm:pl-5">
            <DetailItem label="Display Name" value={displayName} />
            <DetailItem label="Date of Birth" value={formatDate(user.date_of_birth)} />
            <DetailItem label="Gender" value={user.gender || "—"} />
          </div>
        </dl>
      </section>

      <section>
        <div className="mb-3">
          <h4 className="text-base font-bold text-on-background">Public Profile</h4>
          <p className="mt-1 text-xs text-secondary">The information visible on the user&apos;s public profile.</p>
        </div>
        <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div
              role="img"
              aria-label={hasAvatar ? `${displayName} avatar` : "No avatar uploaded"}
              className={`flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-outline-variant bg-primary-fixed text-xl font-bold text-on-primary-fixed ${hasAvatar ? "bg-cover bg-center bg-no-repeat" : ""}`}
              style={hasAvatar ? { backgroundImage: `url(${user.avatar_url})` } : undefined}
            >
              {!hasAvatar && user.username.slice(0, 2).toUpperCase()}
            </div>
            <dl className="min-w-0 flex-1">
              <dt className="text-xs font-medium text-secondary">Bio</dt>
              <dd className="mt-2 whitespace-pre-wrap text-sm leading-6 text-on-background">
                {user.bio || "—"}
              </dd>
            </dl>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3">
          <h4 className="text-base font-bold text-on-background">Location &amp; Preferences</h4>
          <p className="mt-1 text-xs text-secondary">Regional settings used across the account.</p>
        </div>
        <dl className="grid grid-cols-1 divide-y divide-outline-variant/70 rounded-xl border border-outline-variant bg-surface-container-low px-4 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:px-5">
          <div className="sm:pr-5">
            <DetailItem label="Country" value={user.country || "—"} />
            <DetailItem label="City" value={user.city || "—"} />
          </div>
          <div className="sm:pl-5">
            <DetailItem label="Timezone" value={user.timezone || "—"} />
            <DetailItem label="Locale" value={user.locale || "—"} />
          </div>
        </dl>
      </section>
    </div>
  );
}

function CvsContent({ user }: { user: NonNullable<UserDetailsModalProps["user"]> }) {
  const masterCv = user.master_cvs ?? DEMO_MASTER_CV;
  const cvVersions = user.cv_versions?.length ? user.cv_versions : DEMO_CV_VERSIONS;
  const isDeleted = Boolean(masterCv.deleted_at);

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-3">
          <h4 className="text-base font-bold text-on-background">Master CV</h4>
          <p className="mt-1 text-xs text-secondary">The primary CV used as the source for generated versions.</p>
        </div>
        <div className="rounded-xl border border-outline-variant bg-surface-container-low p-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-on-background">Master CV</p>
                <p className="mt-1 text-xs text-secondary">ID #{masterCv.id}</p>
              </div>
            </div>
            <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${isDeleted ? "bg-error/10 text-error" : "bg-emerald-50 text-emerald-700"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isDeleted ? "bg-error" : "bg-emerald-500"}`} />
              {isDeleted ? "Deleted" : "Active"}
            </span>
          </div>
          <dl className="mt-5 grid grid-cols-1 gap-3 border-t border-outline-variant/70 pt-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-secondary">Created</dt>
              <dd className="mt-1 text-sm font-semibold text-on-background">{formatShortDate(masterCv.created_at)}</dd>
            </div>
            <div>
              <dt className="text-xs text-secondary">Last Updated</dt>
              <dd className="mt-1 text-sm font-semibold text-on-background">{formatShortDate(masterCv.updated_at)}</dd>
            </div>
            <div>
              <dt className="text-xs text-secondary">Deleted At</dt>
              <dd className="mt-1 text-sm font-semibold text-on-background">{formatShortDate(masterCv.deleted_at)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section>
        <div className="mb-3">
          <h4 className="text-base font-bold text-on-background">CV Versions</h4>
          <p className="mt-1 text-xs text-secondary">Generated versions and their current status.</p>
        </div>
        <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
          <div className="overflow-x-auto">
            <div className="w-full min-w-[780px]">
              <div className="hidden w-full grid-cols-[70px_minmax(220px,1fr)_110px_100px_125px_220px] gap-4 border-b border-outline-variant px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-secondary lg:grid lg:px-5">
                <span>Version</span>
                <span>Target Role</span>
                <span>Status</span>
                <span>Current</span>
                <span>Created</span>
                <span>Actions</span>
              </div>
              <div>
                {cvVersions.map((cv) => (
                  <div key={`${cv.version}-${cv.created_at}`} className="flex w-full flex-col gap-4 border-b border-outline-variant px-4 py-4 last:border-b-0 lg:grid lg:grid-cols-[70px_minmax(220px,1fr)_110px_100px_125px_220px] lg:items-center lg:gap-4 lg:px-5">
                <div className="flex items-center justify-between lg:block">
                  <span className="text-sm font-bold text-on-background">{cv.version}</span>
                  <span className="text-xs text-secondary lg:hidden">{formatShortDate(cv.created_at)}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-background">{cv.target_role}</p>
                  <p className="mt-1 text-xs text-secondary lg:hidden">Created {formatShortDate(cv.created_at)}</p>
                </div>
                <span className="w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{cv.status}</span>
                <span className={`w-fit text-xs font-semibold ${cv.is_current ? "text-primary" : "text-secondary"}`}>{cv.is_current ? "✓ Yes" : "No"}</span>
                <span className="hidden text-sm text-secondary lg:block">{formatShortDate(cv.created_at)}</span>
                <div className="flex flex-wrap gap-2">
                  <button type="button" title="View CV" className="inline-flex items-center gap-1.5 rounded-md border border-outline-variant px-2.5 py-1.5 text-xs font-semibold text-secondary transition-colors hover:bg-surface-container">
                    <Eye className="h-3.5 w-3.5" />
                    View CV
                  </button>
                  <button type="button" title="Download CV" className="inline-flex items-center gap-1.5 rounded-md border border-outline-variant px-2.5 py-1.5 text-xs font-semibold text-secondary transition-colors hover:bg-surface-container">
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>
                  <button type="button" title="View parsed data" className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10">
                    Parsed Data
                  </button>
                </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function NotificationsContent({ user }: { user: NonNullable<UserDetailsModalProps["user"]> }) {
  const [selectedNotification, setSelectedNotification] = useState<UserNotification | null>(null);
  const [showMetadata, setShowMetadata] = useState(false);
  const notifications = user.notifications?.length ? user.notifications : DEMO_NOTIFICATIONS;

  const handleSelectNotification = (notification: UserNotification) => {
    setSelectedNotification(notification);
    setShowMetadata(false);
  };

  if (selectedNotification) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setSelectedNotification(null)}
          className="mb-5 text-sm font-semibold text-primary hover:underline"
        >
          ← Back to notifications
        </button>
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">Notification Details</p>
          <h4 className="mt-2 text-xl font-bold text-on-background">{selectedNotification.title}</h4>
        </div>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-5 rounded-xl border border-outline-variant bg-surface-container-low p-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-secondary">Type</dt>
            <dd className="mt-1 break-words font-mono text-sm text-on-background">{selectedNotification.type}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-secondary">Title</dt>
            <dd className="mt-1 text-sm font-semibold text-on-background">{selectedNotification.title}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium text-secondary">Message</dt>
            <dd className="mt-1 text-sm leading-6 text-on-background">{selectedNotification.message}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-secondary">Status</dt>
            <dd className={`mt-1 text-sm font-semibold ${selectedNotification.status === "Unread" ? "text-primary" : "text-emerald-700"}`}>
              {selectedNotification.status}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-secondary">Created</dt>
            <dd className="mt-1 text-sm font-semibold text-on-background">{formatDate(selectedNotification.created_at)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-secondary">Read At</dt>
            <dd className="mt-1 text-sm font-semibold text-on-background">{formatDate(selectedNotification.read_at)}</dd>
          </div>
        </dl>

        <div className="mt-5 rounded-xl border border-outline-variant bg-surface-container-low p-4">
          <button
            type="button"
            onClick={() => setShowMetadata((isVisible) => !isVisible)}
            className="flex w-full items-center justify-between gap-4 text-left"
          >
            <span>
              <span className="block text-sm font-bold text-on-background">Additional Data</span>
              <span className="mt-1 block text-xs text-secondary">Technical details for debugging and auditing.</span>
            </span>
            <span className="shrink-0 text-xs font-semibold text-primary">
              {showMetadata ? "Hide Technical Metadata" : "View Technical Metadata"}
            </span>
          </button>
          {showMetadata && (
            <pre className="mt-4 max-h-56 overflow-auto rounded-lg border border-outline-variant bg-surface-container-lowest p-4 text-xs leading-5 text-on-background">
              {JSON.stringify(selectedNotification.metadata ?? {}, null, 2)}
            </pre>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3">
        <h4 className="text-base font-bold text-on-background">Notifications</h4>
        <p className="mt-1 text-xs text-secondary">Notifications sent to this user.</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
        <div className="hidden grid-cols-[minmax(0,1fr)_minmax(150px,0.9fr)_100px_130px] gap-4 border-b border-outline-variant px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-secondary md:grid">
          <span>Type / Title</span>
          <span>Status</span>
          <span>Created</span>
          <span>Action</span>
        </div>
        <div>
          {notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => handleSelectNotification(notification)}
              className="grid w-full grid-cols-1 gap-3 border-b border-outline-variant px-4 py-4 text-left last:border-b-0 hover:bg-surface-container md:grid-cols-[minmax(0,1fr)_minmax(150px,0.9fr)_100px_130px] md:items-center md:gap-4 md:px-5"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-on-background">{notification.title}</span>
                <span className="mt-1 block break-words font-mono text-[11px] text-secondary">{notification.type}</span>
              </span>
              <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${notification.status === "Unread" ? "bg-primary/10 text-primary" : "bg-emerald-50 text-emerald-700"}`}>
                {notification.status}
              </span>
              <span className="text-sm text-secondary">{formatShortDate(notification.created_at)}</span>
              <span className="text-xs font-semibold text-primary">View Details</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuthenticationContent({
  user,
  authenticationData,
}: {
  user: NonNullable<UserDetailsModalProps["user"]>;
  authenticationData?: AuthenticationResponse;
}) {
  const authMethods = user.auth_methods ?? [];
  const apiHistory = authenticationData ? normalizeVerificationHistory(authenticationData) : null;
  const initialHistory = apiHistory?.results ?? user.verification_tokens ?? [];
  const initialCount = apiHistory?.count ?? initialHistory.length;
  const [verificationTokens, setVerificationTokens] = useState(initialHistory);
  const [verificationCount, setVerificationCount] = useState(initialCount);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [verificationPage, setVerificationPage] = useState(1);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchVerificationHistory = async (status: string, page: number) => {
    setHistoryLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), page_size: "20" });
      if (status) params.set("status", status);
      const response = await api.get<AuthenticationResponse | VerificationHistoryPage | VerificationToken[]>(
        `v1/auth/admin/${user.id}/?${params.toString()}`,
      );
      const history = normalizeVerificationHistory(response.data);
      setVerificationTokens(history.results);
      setVerificationCount(history.count);
      setVerificationPage(page);
    } catch {
      toast.error("Unable to load verification events", {
        description: "Please try again in a moment.",
      });
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleVerificationStatusChange = (status: string) => {
    setVerificationStatus(status);
    void fetchVerificationHistory(status, 1);
  };

  const handleVerificationPageChange = (page: number) => {
    void fetchVerificationHistory(verificationStatus, page);
  };

  return (
    <div>
      <div className="mb-3">
        <h4 className="text-base font-bold text-on-background">Login Methods</h4>
        <p className="mt-1 text-xs text-secondary">Connected providers and their verification status.</p>
      </div>

      {authMethods.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {authMethods.map((method, index) => {
            const provider = method.provider || "Unknown";
            const providerKey = provider.toLowerCase();
            const ProviderIcon = providerKey.includes("google") ? CircleUserRound : providerKey.includes("email") ? Mail : ShieldCheck;
            const verification = method.verification_status ?? method.is_verified;
            const active = method.active_status ?? method.is_active;
            const linkedDate = method.linked_date ?? method.linked_at;
            const lastUsed = method.last_used ?? method.last_used_at;

            return (
              <article key={`${provider}-${index}`} className="rounded-xl border border-outline-variant bg-surface-container-low p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ProviderIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold capitalize text-on-background">{provider}</h5>
                      {method.provider_email && <p className="mt-0.5 text-xs text-secondary">{method.provider_email}</p>}
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${active === true || active === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-surface-container text-secondary"}`}>
                    {typeof active === "string" ? active : active === true ? "Active" : active === false ? "Inactive" : "—"}
                  </span>
                </div>

                <dl className="mt-5 space-y-3 border-t border-outline-variant/70 pt-4">
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <dt className="text-secondary">Verified</dt>
                    <dd className={`font-semibold ${verification === true || verification === "Verified" ? "text-emerald-700" : "text-on-background"}`}>
                      {verification === true || verification === "Verified" ? "✓ Yes" : verification === false || verification === "Unverified" ? "No" : "—"}
                    </dd>
                  </div>
                  {linkedDate && (
                    <div className="flex items-center justify-between gap-4 text-xs">
                      <dt className="text-secondary">Linked</dt>
                      <dd className="font-semibold text-on-background">{formatShortDate(linkedDate)}</dd>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <dt className="text-secondary">Last Used</dt>
                    <dd className="font-semibold text-on-background">{formatShortDate(lastUsed)}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-52 items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-container-low px-6 py-10 text-center">
          <div>
            <ShieldCheck className="mx-auto h-8 w-8 text-secondary" />
            <p className="mt-4 text-sm font-semibold text-on-background">No login methods available</p>
            <p className="mt-1 text-xs text-secondary">Connected authentication providers will appear here.</p>
          </div>
        </div>
      )}

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-on-background">Verification &amp; Security Events</h4>
            <p className="mt-1 text-xs text-secondary">Recent verification and account security events.</p>
          </div>
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-xs font-semibold text-secondary">
            Status
            <select
              value={verificationStatus}
              onChange={(event) => handleVerificationStatusChange(event.target.value)}
              className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-xs font-medium text-on-background focus:border-primary focus:outline-none"
            >
              <option value="">All statuses</option>
              <option value="used">Used</option>
              <option value="expired">Expired</option>
              <option value="revoked">Revoked</option>
            </select>
          </label>
          <span className="text-xs text-secondary">{verificationCount} event{verificationCount === 1 ? "" : "s"}</span>
        </div>
        <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
          <div className="hidden grid-cols-[minmax(0,1.5fr)_minmax(110px,0.8fr)_minmax(120px,1fr)_minmax(120px,1fr)] gap-4 border-b border-outline-variant px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-secondary lg:grid lg:px-5">
            <span>Type</span>
            <span>Status</span>
            <span>Created</span>
            <span>Expires</span>
          </div>
          <div className={`divide-y divide-outline-variant ${historyLoading ? "opacity-50" : ""}`}>
            {verificationTokens.map((token) => {
              const status = {
                used: { label: "Used", icon: CheckCircle2, className: "text-emerald-700 bg-emerald-50" },
                active: { label: "Active", icon: Clock3, className: "text-primary bg-primary/10" },
                expired: { label: "Expired", icon: TriangleAlert, className: "text-amber-700 bg-amber-50" },
                revoked: { label: "Revoked", icon: LockKeyhole, className: "text-error bg-error/10" },
              }[token.status];
              const StatusIcon = status.icon;

              return (
                <div key={`${token.type}-${token.created_at}`} className="grid grid-cols-1 gap-3 px-4 py-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(110px,0.8fr)_minmax(120px,1fr)_minmax(120px,1fr)] lg:items-center lg:gap-4 lg:px-5">
                  <div>
                    <p className="text-sm font-semibold text-on-background">{token.type}</p>
                    <p className="mt-1 text-[11px] text-secondary lg:hidden">Created {formatShortDate(token.created_at)} · Expires {formatShortDate(token.expires_at)}</p>
                  </div>
                  <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {status.label}
                  </span>
                  <span className="hidden text-sm text-secondary lg:block">{formatShortDate(token.created_at)}</span>
                  <span className="hidden text-sm text-secondary lg:block">{formatShortDate(token.expires_at)}</span>
                </div>
              );
            })}
            {verificationTokens.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-secondary">No verification events found.</p>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-outline-variant px-4 py-3 sm:px-5">
            <span className="text-xs text-secondary">Page {verificationPage}</span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={verificationPage === 1 || historyLoading}
                onClick={() => handleVerificationPageChange(verificationPage - 1)}
                className="rounded-md border border-outline-variant px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={verificationPage * 20 >= verificationCount || historyLoading}
                onClick={() => handleVerificationPageChange(verificationPage + 1)}
                className="rounded-md border border-outline-variant px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ActivityContent({ user }: { user: NonNullable<UserDetailsModalProps["user"]> }) {
  const activity = user.activity_summary ?? {
    notifications_count: 12,
    unread_notifications_count: 2,
  };
  const authenticationMethods = user.auth_methods?.length
    ? user.auth_methods.map((method) => method.provider).join(", ")
    : "Google, Email";
  const cvVersionCount = user.cv_versions?.length || 3;

  const items = [
    ["Account Created", formatShortDate(user.date_joined || "2026-09-01")],
    ["Last Login", formatShortDate(user.last_login || "2026-09-09")],
    ["Authentication Methods Used", authenticationMethods],
    ["CV Versions", String(cvVersionCount)],
    ["Notifications", String(activity.notifications_count)],
    ["Unread Notifications", String(activity.unread_notifications_count)],
  ];

  return (
    <div>
      <div className="mb-3">
        <h4 className="text-base font-bold text-on-background">Account Activity</h4>
        <p className="mt-1 text-xs text-secondary">A quick summary of recent account activity and system information.</p>
      </div>
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-outline-variant bg-surface-container-low px-4 py-4">
            <dt className="text-xs font-medium text-secondary">{label}</dt>
            <dd className={`mt-2 text-sm font-bold ${label === "Unread Notifications" && value !== "0" ? "text-primary" : "text-on-background"}`}>
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [tabData, setTabData] = useState<Record<string, unknown>>({});
  const [loadingTab, setLoadingTab] = useState<string | null>("Overview");
  const [tabError, setTabError] = useState<string | null>(null);

  const fetchTabData = useCallback(async (tab: string) => {
    if (!user || tabData[tab]) return;

    setLoadingTab(tab);
    setTabError(null);

    try {
      const endpoint = tab === "Profile"
        ? `v1/profiles/admin/${user.id}/`
        : tab === "Authentication & Security"
          ? `v1/auth/admin/${user.id}/?page=1&page_size=20`
        : `v1/users/admin/${user.id}/${TAB_ENDPOINTS[tab]}/`;
      const response = await api.get(endpoint);
      setTabData((current) => ({ ...current, [tab]: response.data }));
    } catch {
      setTabError(`Unable to load ${tab.toLowerCase()} data right now.`);
    } finally {
      setLoadingTab(null);
    }
  }, [tabData, user]);

  useEffect(() => {
    if (!user) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, user]);

  useEffect(() => {
    if (user) void Promise.resolve().then(() => fetchTabData("Overview"));
  }, [fetchTabData, user]);

  if (!user) return null;

  const initials = user.username.slice(0, 2).toUpperCase();
  const overviewData = tabData.Overview as OverviewResponse | undefined;
  const profileData = tabData.Profile as ProfileResponse | undefined;
  const authenticationData = tabData["Authentication & Security"] as AuthenticationResponse | undefined;
  const activeTabData = tabData[activeTab];
  const displayUser = overviewData
    ? {
        ...user,
        email: overviewData.contact.email,
        phone_number: overviewData.contact.phone_number,
        is_active: overviewData.account.is_active,
        is_staff: overviewData.permissions.is_staff,
        is_superuser: overviewData.permissions.is_superuser,
        email_verified: overviewData.verification.email_verified,
        phone_verified: overviewData.verification.phone_verified,
        date_joined: overviewData.timestamps.joined_at,
        last_login: overviewData.timestamps.last_login,
        updated_at: overviewData.timestamps.last_updated,
        deactivated_at: overviewData.account.deactivated_at,
      }
    : user;
  const profileUser = profileData
    ? {
        ...displayUser,
        first_name: profileData.name.first_name,
        last_name: profileData.name.last_name,
        display_name: profileData.name.display_name,
        avatar_url: profileData.profile.avatar_url,
        bio: profileData.profile.bio,
        date_of_birth: profileData.personal.date_of_birth,
        gender: profileData.personal.gender,
        country: profileData.location.country,
        city: profileData.location.city,
        timezone: profileData.location.timezone,
        locale: profileData.locale,
      }
    : displayUser;
  const authenticationUser = authenticationData
    ? {
        ...displayUser,
        auth_methods: authenticationData.authentication_methods.map((method) => ({
          provider: method.provider,
          provider_email: method.provider_email,
          is_verified: method.verification.is_verified,
          is_active: method.status.is_active,
          linked_at: method.linked_at,
          last_used_at: method.last_used_at,
        })),
        verification_tokens: Array.isArray(authenticationData.verification_history)
          ? authenticationData.verification_history
          : authenticationData.verification_history?.results ?? [],
      }
    : displayUser;
  const contentUser = activeTab === "Profile"
    ? profileUser
    : activeTab === "Authentication & Security"
      ? authenticationUser
    : activeTabData && typeof activeTabData === "object"
      ? { ...displayUser, ...(activeTabData as Partial<typeof displayUser>) }
      : displayUser;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    void fetchTabData(tab);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/45 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="user-details-title"
        aria-modal="true"
        className="flex max-h-[min(760px,calc(100vh-2rem))] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl"
        role="dialog"
      >
        <header className="flex items-start justify-between border-b border-outline-variant px-5 py-5 sm:px-7">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-sm font-bold text-on-primary-fixed">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="user-details-title" className="truncate text-lg font-bold text-on-background">
                  {user.username}
                </h2>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${user.is_active ? "bg-emerald-50 text-emerald-700" : "bg-surface-container text-secondary"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? "bg-emerald-500" : "bg-outline"}`} />
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-secondary">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close user details"
            onClick={onClose}
            className="ml-4 rounded-lg p-2 text-secondary transition-colors hover:bg-surface-container hover:text-on-background"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <nav aria-label="User detail sections" className="shrink-0 border-b border-outline-variant bg-surface-container-low px-3 py-3 md:w-64 md:border-b-0 md:border-r md:px-4 md:py-5">
            <p className="mb-2 hidden px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-secondary md:block">
              User details
            </p>
            <div className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
              {tabs.map(({ label, icon: Icon }) => {
                const isActive = activeTab === label;
                return (
                  <button
                    key={label}
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => handleTabChange(label)}
                    className={`flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors md:w-full ${isActive ? "bg-primary text-on-primary shadow-sm" : "text-secondary hover:bg-surface-container hover:text-on-background"}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="min-h-[280px] flex-1 overflow-y-auto p-5 sm:p-7">
            {loadingTab === activeTab && !tabData[activeTab] ? (
              <div className="flex min-h-[420px] items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
                  <p className="text-sm font-semibold text-on-background">Loading {activeTab.toLowerCase()}...</p>
                  <p className="text-xs text-secondary">Fetching the latest user details.</p>
                </div>
              </div>
            ) : (
              <>
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">{activeTab}</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-on-background">{activeTab}</h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-secondary">
                {activeTab === "Overview"
                  ? "The most important account information and timeline at a glance."
                  : `Information about this user's ${activeTab.toLowerCase()} will appear here.`}
              </p>
            </div>

            {tabError && (
              <div className="mb-5 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
                {tabError}
              </div>
            )}

            {activeTab === "Overview" ? <OverviewContent user={contentUser} /> : activeTab === "Profile" ? <ProfileContent user={contentUser} /> : activeTab === "Authentication & Security" ? <AuthenticationContent user={contentUser} authenticationData={authenticationData} /> : activeTab === "CVs" ? <CvsContent user={contentUser} /> : activeTab === "Notifications" ? <NotificationsContent user={contentUser} /> : activeTab === "Activity" ? <ActivityContent user={contentUser} /> : (
              <div className="flex min-h-52 items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-container-low px-6 py-10 text-center">
                <div>
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-surface-container text-secondary">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-on-background">Ready for account data</p>
                  <p className="mt-1 text-xs text-secondary">This section is set up for the next step.</p>
                </div>
              </div>
            )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}