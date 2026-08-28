"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";

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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-label-caps text-label-caps font-semibold border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
        Ready
      </span>
    );
  }
  if (status === "processing") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-label-caps text-label-caps font-semibold border border-amber-200">
        <span className="material-symbols-outlined text-[13px] animate-spin">
          sync
        </span>
        Processing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-label-caps text-label-caps font-semibold border border-red-200">
      <span className="material-symbols-outlined text-[13px]">
        error_outline
      </span>
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
    <tr className="group hover:bg-surface-container-low/50 transition-colors duration-150 border-b border-outline-variant/30 last:border-0">
      {/* Document Name */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-150 ${
              fileType === "pdf"
                ? "bg-primary/8 text-primary group-hover:bg-primary/14"
                : "bg-tertiary/8 text-tertiary group-hover:bg-tertiary/14"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {fileType === "pdf" ? "picture_as_pdf" : "description"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-title-sm text-title-sm text-on-surface truncate max-w-[220px]">
              {displayName}
            </p>
            {cv.is_current && (
              <span className="inline-flex items-center px-2 py-0.5 mt-0.5 rounded-full bg-primary/10 text-primary font-label-caps text-[10px] uppercase font-semibold tracking-wide">
                ★ Current
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Version */}
      <td className="py-4 px-6">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps border border-outline-variant/50">
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
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            title="Download"
            className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/8 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
          </button>
          <button
            title="Preview"
            className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/8 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          </button>
          <button
            title="More options"
            onClick={() => onMenuClick(cv.id)}
            className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">more_vert</span>
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
  const [isDragging, setIsDragging] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

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
    let cancelled = false;
    setStatsLoading(true);
    setStatsError(false);
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
  }, []);

  // Fetch CV list
  useEffect(() => {
    let cancelled = false;
    setCvsLoading(true);
    setCvsError(false);
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
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // handle dropped files here
  };

  const statItems = [
    { label: "Total CVs",  key: "total",      icon: "folder_open",  color: "text-primary bg-primary/8" },
    { label: "Ready",      key: "ready",      icon: "check_circle", color: "text-emerald-600 bg-emerald-50" },
    { label: "Processing", key: "processing", icon: "sync",         color: "text-amber-600 bg-amber-50" },
    { label: "Failed",     key: "failed",     icon: "error_outline", color: "text-red-600 bg-red-50" },
  ] as const;

  return (
    <main className="flex-grow p-container-padding">
      <div className="max-w-6xl mx-auto flex flex-col gap-stack-gap">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display-lg text-display-lg text-on-surface tracking-tight">
              My CVs
            </h2>
            <p className="font-body-md text-body-md text-secondary mt-1">
              Manage and upload your resumes for different job applications.
            </p>
          </div>
          <button className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-title-sm text-title-sm rounded-xl hover:bg-surface-tint active:scale-[0.98] transition-all shadow-sm shadow-primary/20">
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            Upload CV
          </button>
        </div>

        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-grid-gutter">
          {statItems.map((stat) => {
            const value = stats?.[stat.key];
            return (
              <div
                key={stat.label}
                className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-4 flex items-center gap-3"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${stat.color}`}>
                  <span className="material-symbols-outlined text-[18px]">{stat.icon}</span>
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
                      <p className="font-label-caps text-label-caps text-on-surface-variant mt-0.5">{stat.label}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-stat-lg text-[22px] font-semibold text-on-surface leading-none">
                        {value ?? 0}
                      </p>
                      <p className="font-label-caps text-label-caps text-on-surface-variant mt-0.5">
                        {stat.label}
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CV Table Card ── */}
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30">
            <h3 className="font-title-sm text-title-sm text-on-surface">
              All Documents
            </h3>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low font-body-sm text-body-sm transition-colors">
                <span className="material-symbols-outlined text-[16px]">filter_list</span>
                Filter
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low font-body-sm text-body-sm transition-colors">
                <span className="material-symbols-outlined text-[16px]">sort</span>
                Sort
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/60">
                  <th className="py-3 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">
                    Document
                  </th>
                  <th className="py-3 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">
                    Version
                  </th>
                  <th className="py-3 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">
                    Uploaded
                  </th>
                  <th className="py-3 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">
                    Status
                  </th>
                  <th className="py-3 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold text-right">
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
                        <span className="material-symbols-outlined text-[36px] text-red-400">cloud_off</span>
                        <p className="font-body-md text-body-md">Failed to load CVs. Please try again later.</p>
                      </div>
                    </td>
                  </tr>
                ) : cvs.length === 0 ? (
                  // Empty state
                  <tr>
                    <td colSpan={5} className="py-14 text-center">
                      <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[36px]">folder_open</span>
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
          <div className="px-6 py-3 border-t border-outline-variant/30 flex items-center justify-between">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {cvsLoading
                ? "Loading documents…"
                : `Showing ${cvs.length} of ${cvs.length} documents`}
            </p>
            <button className="inline-flex items-center gap-1.5 font-body-sm text-body-sm text-primary hover:underline transition-colors">
              View all
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* ── Upload Drop Zone ── */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all duration-200 ${
            isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-outline-variant/60 bg-surface-container-lowest hover:border-primary/40 hover:bg-surface-container-low/40"
          }`}
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-200 ${
              isDragging ? "bg-primary/12 text-primary" : "bg-surface-container text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-[28px]">
              cloud_upload
            </span>
          </div>
          <h4 className="font-headline-md text-headline-md text-on-surface font-semibold mb-2">
            {isDragging ? "Drop to upload" : "Drag & drop your CV here"}
          </h4>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xs mb-5">
            or{" "}
            <button className="text-primary font-medium hover:underline focus:outline-none">
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
