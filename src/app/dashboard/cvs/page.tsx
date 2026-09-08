"use client";

import { startTransition, useState, useEffect, useRef } from "react";
import api from "@/lib/axios";
import { isCvRealtimeEvent } from "@/store/slices/notificationSlice";
import { useAppSelector } from "@/store";
import {
  ArrowDownUp,
  CheckCircle2,
  CircleAlert,
  CloudOff,
  CloudUpload,
  Download,
  ExternalLink,
  FileText,
  FileType2,
  Filter,
  FolderOpen,
  MoreHorizontal,
  RefreshCw,
  Sparkles,
  Target,
  Upload,
  LoaderCircle,
  type LucideIcon,
} from "lucide-react";

// ── API types ────────────────────────────────────────────────────────────────

interface MasterCVVersion {
  id: string;
  version: number;
  master_cv_id: string;
  target_role: string;
  is_current: boolean;
  s3_key: string;
  status: "completed" | "processing" | "failed";
  created_at: string;
}

interface CVStats {
  total: number;
  ready: number;
  processing: number;
  failed: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function fileTypeFromKey(s3Key: string): "pdf" | "docx" {
  return s3Key.toLowerCase().endsWith(".docx") ? "docx" : "pdf";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: MasterCVVersion["status"] }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Ready
      </span>
    );
  }
  if (status === "processing") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
        Processing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
      <CircleAlert className="h-3.5 w-3.5" />
      Failed
    </span>
  );
}

function CVRow({
  cv,
  onMenuClick,
}: {
  cv: MasterCVVersion;
  onMenuClick: (id: string) => void;
}) {
  const fileType = fileTypeFromKey(cv.s3_key);
  // Derive a display name: use target_role + version
  const displayName = `${cv.target_role} — v${cv.version}.${fileType}`;

  return (
    <tr className="group border-b border-outline-variant/30 transition-colors duration-150 last:border-0 hover:bg-surface-container-low/50">
      {/* Document Name */}
      <td className="hidden px-6 py-4 sm:table-cell">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-150 ${fileType === "pdf"
              ? "bg-primary/8 text-primary group-hover:bg-primary/14"
              : "bg-tertiary/8 text-tertiary group-hover:bg-tertiary/14"
              }`}
          >
            {fileType === "pdf" ? <FileText className="h-5 w-5" /> : <FileType2 className="h-5 w-5" />}
          </div>
          <div className="min-w-0">
            <p className="font-title-sm text-title-sm text-on-surface truncate max-w-[220px]">
              {displayName}
            </p>
            {cv.is_current && (
              <span className="mt-0.5 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                Current
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Version */}
      <td className="hidden px-6 py-4 md:table-cell">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs border border-outline-variant/50">
          v{cv.version}
        </span>
      </td>

      {/* Uploaded Date */}
      <td className="py-4 px-6">
        <span className="font-body-md text-body-md text-on-surface-variant">
          {formatDate(cv.created_at)}
        </span>
      </td>

      {/* Status */}
      <td className="py-4 px-6">
        <StatusBadge status={cv.status} />
      </td>

      {/* Actions */}
      <td className="py-4 px-6">
        <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity duration-150 lg:opacity-0 lg:group-hover:opacity-100">
          <button
            title="Download"
            aria-label={`Download ${displayName}`}
            className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-primary/8 hover:text-primary"
          >
            <Download className="h-[18px] w-[18px]" />
          </button>
          <button
            title="Preview"
            aria-label={`Preview ${displayName}`}
            className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-primary/8 hover:text-primary"
          >
            <ExternalLink className="h-[18px] w-[18px]" />
          </button>
          <button
            title="More options"
            aria-label={`More options for ${displayName}`}
            onClick={() => onMenuClick(cv.id)}
            className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            <MoreHorizontal className="h-[18px] w-[18px]" />
          </button>
        </div>
      </td>
    </tr>
  );
}

/** Skeleton row shown while CVs are loading */
function CVRowSkeleton() {
  return (
    <tr className="border-b border-outline-variant/30 last:border-0">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-container animate-pulse shrink-0" />
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-40 rounded-md bg-surface-container animate-pulse" />
            <div className="h-3 w-14 rounded-md bg-surface-container animate-pulse" />
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="h-5 w-10 rounded-full bg-surface-container animate-pulse" />
      </td>
      <td className="py-4 px-6">
        <div className="h-4 w-24 rounded-md bg-surface-container animate-pulse" />
      </td>
      <td className="py-4 px-6">
        <div className="h-6 w-20 rounded-full bg-surface-container animate-pulse" />
      </td>
      <td className="py-4 px-6" />
    </tr>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MyCVsPage() {
  const lastRealtimeEvent = useAppSelector(
    (state) => state.notifications.lastEvent,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [targetRole, setTargetRole] = useState("frontend developer");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats
  const [stats, setStats] = useState<CVStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  // CV list
  const [cvs, setCvs] = useState<MasterCVVersion[]>([]);
  const [cvsLoading, setCvsLoading] = useState(true);
  const [cvsError, setCvsError] = useState(false);

  // Fetch stats
  useEffect(() => {
    if (lastRealtimeEvent && !isCvRealtimeEvent(lastRealtimeEvent)) return;

    let cancelled = false;
    startTransition(() => {
      setStatsLoading(true);
      setStatsError(false);
    });
    api
      .get<CVStats>("ai/v1/master-cv/stats")
      .then((res) => {
        if (!cancelled) setStats(res.data);
      })
      .catch(() => {
        if (!cancelled) setStatsError(true);
      })
      .finally(() => {
        if (!cancelled) setStatsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [lastRealtimeEvent, refreshKey]);

  // Fetch CV list
  useEffect(() => {
    if (lastRealtimeEvent && !isCvRealtimeEvent(lastRealtimeEvent)) return;

    let cancelled = false;
    startTransition(() => {
      setCvsLoading(true);
      setCvsError(false);
    });
    api
      .get<MasterCVVersion[]>("ai/v1/master-cv")
      .then((res) => {
        if (!cancelled) setCvs(res.data);
      })
      .catch(() => {
        if (!cancelled) setCvsError(true);
      })
      .finally(() => {
        if (!cancelled) setCvsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [lastRealtimeEvent, refreshKey]);

  const uploadCV = async (file: File) => {
    setUploadMessage(null);
    setUploadError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_role", targetRole.trim() || "frontend developer");

    try {
      await api.post("ai/v1/master-cv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadMessage(`${file.name} uploaded successfully.`);
      setSelectedFile(null);
      setShowUploadForm(false);
      setRefreshKey((value) => value + 1);
    } catch {
      setUploadError("Upload failed. Please check the file and try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (file: File | undefined) => {
    if (!file) return;
    if (!/application\/pdf|application\/vnd.openxmlformats-officedocument.wordprocessingml.document/.test(file.type) && !/\.(pdf|docx)$/i.test(file.name)) {
      setUploadError("Please choose a PDF or DOCX file.");
      return;
    }
    setSelectedFile(file);
    setUploadError(null);
  };

  const handleUploadSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedFile) void uploadCV(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const statItems: { label: string; key: keyof CVStats; icon: LucideIcon; color: string }[] = [
    { label: "Total CVs", key: "total", icon: FolderOpen, color: "text-primary bg-primary/8" },
    { label: "Ready", key: "ready", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
    { label: "Processing", key: "processing", icon: RefreshCw, color: "text-amber-600 bg-amber-50" },
    { label: "Failed", key: "failed", icon: CircleAlert, color: "text-red-600 bg-red-50" },
  ] as const;

  const readinessInsights = [
    { label: "Contact details", value: "Complete", done: true },
    { label: "Role keywords", value: "Add 3 more", done: false },
    { label: "Impact statements", value: "Strong", done: true },
  ];

  return (
    <main className="flex-grow w-full p-4 sm:p-6 lg:p-container-padding">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">

        {/* ── Page Header ── */}
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <FileText className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em]">Master CV</span>
            </div>
            <h2 className="font-display-lg text-display-lg tracking-tight text-on-surface">
              Your career library
            </h2>
            <p className="mt-1 max-w-[36rem] font-body-md text-body-md text-secondary">
              Keep one strong source resume and create tailored versions when the opportunity calls for it.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowUploadForm((value) => !value)}
            disabled={isUploading}
            className="inline-flex items-center gap-2 justify-self-start rounded-lg bg-primary px-4 py-2.5 font-title-sm text-title-sm text-on-primary shadow-sm shadow-primary/20 transition-all hover:bg-surface-tint active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 sm:justify-self-end"
          >
            {isUploading ? <LoaderCircle className="h-[18px] w-[18px] animate-spin" /> : <Upload className="h-[18px] w-[18px]" />}
            {isUploading ? "Uploading..." : showUploadForm ? "Close upload" : "Upload CV"}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(event) => {
            handleFileSelect(event.target.files?.[0]);
            event.target.value = "";
          }}
        />

        {showUploadForm && (
          <form onSubmit={handleUploadSubmit} className="grid gap-4 rounded-xl border border-primary/20 bg-primary/[0.03] p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
            <div className="flex flex-col gap-2">
              <label htmlFor="target-role" className="text-[13px] font-semibold text-on-surface">
                Target role
              </label>
              <input
                id="target-role"
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                placeholder="frontend developer"
                className="h-10 w-full rounded-lg border border-outline-variant bg-surface px-3 text-[14px] text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[13px] font-semibold text-on-surface">CV file</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-10 min-w-0 items-center gap-2 rounded-lg border border-dashed border-outline-variant bg-surface px-3 text-left text-[14px] text-on-surface-variant transition hover:border-primary hover:text-primary"
              >
                <FileText className="h-4 w-4 shrink-0" />
                <span className="truncate">{selectedFile?.name || "Choose PDF or DOCX"}</span>
              </button>
            </div>
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-[13px] font-semibold text-on-primary transition hover:bg-surface-tint disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {isUploading ? "Uploading..." : "Upload file"}
            </button>
          </form>
        )}

        {(uploadMessage || uploadError) && (
          <p className={`text-[13px] ${uploadError ? "text-error" : "text-emerald-700"}`} role="status">
            {uploadError || uploadMessage}
          </p>
        )}

        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-grid-gutter">
          {statItems.map((stat) => {
            const value = stats?.[stat.key];
            return (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-4 py-4"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${stat.color}`}>
                  <stat.icon className="h-[18px] w-[18px]" />
                </div>
                <div>
                  {statsLoading ? (
                    <>
                      <div className="h-6 w-8 rounded-md bg-surface-container animate-pulse mb-1" />
                      <div className="h-3 w-14 rounded-md bg-surface-container animate-pulse" />
                    </>
                  ) : statsError ? (
                    <>
                      <p className="font-stat-lg text-[22px] font-semibold text-on-surface-variant leading-none">—</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{stat.label}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-stat-lg text-[22px] font-semibold text-on-surface leading-none">
                        {value ?? 0}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {stat.label}
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Local CV readiness feature ── */}
        <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="relative overflow-hidden rounded-2xl bg-[#0f3d67] p-6 text-white shadow-sm sm:p-7">
            <div className="relative z-10 max-w-[32rem]">
              <div className="mb-5 flex items-center gap-2 text-[#b9e8ff]">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.14em]">Smart readiness</span>
              </div>
              <h3 className="text-[24px] font-[600] leading-8 tracking-tight">Your master CV is almost ready to work harder.</h3>
              <p className="mt-2 max-w-[28rem] text-[14px] leading-6 text-[#d7efff]">A few focused improvements can make your profile easier for recruiters and matching systems to understand.</p>
              <button className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-xs font-semibold text-[#0f3d67] transition-colors hover:bg-[#e8f6ff]">
                Review suggestions
                <Target className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-[24px] border-white/10" />
            <div className="absolute -bottom-24 right-20 h-52 w-52 rounded-full border-[24px] border-[#66d2e8]/20" />
          </div>

          <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-on-surface-variant">Readiness score</p>
                <p className="mt-1 text-[32px] font-[600] leading-9 text-on-surface">82<span className="text-[16px] text-on-surface-variant">/100</span></p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full border-[5px] border-emerald-100 text-[12px] font-semibold text-emerald-700">82%</div>
            </div>
            <div className="mt-5 space-y-3">
              {readinessInsights.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 text-[13px]">
                  <span className="flex items-center gap-2 text-on-surface-variant">
                    {item.done ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <CircleAlert className="h-4 w-4 text-amber-600" />}
                    {item.label}
                  </span>
                  <span className={item.done ? "font-semibold text-emerald-700" : "font-semibold text-amber-700"}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CV Table Card ── */}
        <div className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm">
          {/* Card Header */}
          <div className="flex items-center justify-between gap-4 border-b border-outline-variant/30 px-4 py-4 sm:px-6">
            <h3 className="font-title-sm text-title-sm text-on-surface">
              All Documents
            </h3>
            <div className="flex items-center gap-2">
              <button aria-label="Filter documents" title="Filter documents" className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary">
                <Filter className="h-4 w-4" />
              </button>
              <button aria-label="Sort documents" title="Sort documents" className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary">
                <ArrowDownUp className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/60">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant sm:px-6">
                    Document
                  </th>
                  <th className="hidden px-6 py-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant sm:table-cell">
                    Version
                  </th>
                  <th className="hidden px-6 py-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant md:table-cell">
                    Uploaded
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant sm:px-6">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant sm:px-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {cvsLoading ? (
                  // Skeleton rows while fetching
                  Array.from({ length: 3 }).map((_, i) => <CVRowSkeleton key={i} />)
                ) : cvsError ? (
                  // Error state
                  <tr>
                    <td colSpan={5} className="py-14 text-center">
                      <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                        <CloudOff className="h-9 w-9 text-red-400" />
                        <p className="font-body-md text-body-md">Failed to load CVs. Please try again later.</p>
                      </div>
                    </td>
                  </tr>
                ) : cvs.length === 0 ? (
                  // Empty state
                  <tr>
                    <td colSpan={5} className="py-14 text-center">
                      <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                        <FolderOpen className="h-9 w-9" />
                        <p className="font-body-md text-body-md">No CVs uploaded yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  cvs.map((cv) => (
                    <CVRow
                      key={cv.id}
                      cv={cv}
                      onMenuClick={(id) =>
                        setActiveMenu(activeMenu === id ? null : id)
                      }
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Card Footer */}
          <div className="flex items-center justify-between border-t border-outline-variant/30 px-4 py-3 sm:px-6">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {cvsLoading
                ? "Loading documents…"
                : `Showing ${cvs.length} of ${cvs.length} documents`}
            </p>
            <button className="inline-flex items-center gap-1.5 font-body-sm text-body-sm text-primary hover:underline transition-colors">
              View all
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ── Upload Drop Zone ── */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all duration-200 ${isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-outline-variant/60 bg-surface-container-lowest hover:border-primary/40 hover:bg-surface-container-low/40"
            }`}
        >
          <div
            className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-200 ${isDragging ? "bg-primary/12 text-primary" : "bg-surface-container text-on-surface-variant"
              }`}
          >
            <CloudUpload className="h-7 w-7" />
          </div>
          <h4 className="font-headline-md text-headline-md text-on-surface font-semibold mb-2">
            {isDragging ? "Drop to upload" : "Drag & drop your CV here"}
          </h4>
          <p className="mb-5 max-w-[20rem] font-body-md text-body-md text-on-surface-variant">
            or{" "}
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-primary font-medium hover:underline focus:outline-none">
              browse from your computer
            </button>{" "}
            to get started.
          </p>
          <p className="font-body-sm text-body-sm text-outline">
            Supported: PDF, DOCX · Max size 5 MB
          </p>
        </div>

      </div>
    </main>
  );
}
