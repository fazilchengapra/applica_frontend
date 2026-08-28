"use client";

import { useState } from "react";

type CVStatus = "Ready" | "Processing" | "Failed";

interface CV {
  id: number;
  name: string;
  version: string;
  uploadedDate: string;
  status: CVStatus;
  isMaster?: boolean;
  fileType: "pdf" | "docx";
}

const mockCVs: CV[] = [
  {
    id: 1,
    name: "Fazil_Resume_Master.pdf",
    version: "v3",
    uploadedDate: "Oct 12, 2025",
    status: "Ready",
    isMaster: true,
    fileType: "pdf",
  },
  {
    id: 2,
    name: "Marketing_Specialist_Draft.pdf",
    version: "v2",
    uploadedDate: "Oct 10, 2025",
    status: "Processing",
    fileType: "pdf",
  },
  {
    id: 3,
    name: "Old_Resume_2022.docx",
    version: "v1",
    uploadedDate: "Jan 15, 2022",
    status: "Failed",
    fileType: "docx",
  },
];

function StatusBadge({ status }: { status: CVStatus }) {
  if (status === "Ready") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-label-caps text-label-caps font-semibold border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
        Ready
      </span>
    );
  }
  if (status === "Processing") {
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

function CVRow({ cv, onMenuClick }: { cv: CV; onMenuClick: (id: number) => void }) {
  return (
    <tr className="group hover:bg-surface-container-low/50 transition-colors duration-150 border-b border-outline-variant/30 last:border-0">
      {/* Document Name */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-150 ${
              cv.fileType === "pdf"
                ? "bg-primary/8 text-primary group-hover:bg-primary/14"
                : "bg-tertiary/8 text-tertiary group-hover:bg-tertiary/14"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {cv.fileType === "pdf" ? "picture_as_pdf" : "description"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-title-sm text-title-sm text-on-surface truncate max-w-[220px]">
              {cv.name}
            </p>
            {cv.isMaster && (
              <span className="inline-flex items-center px-2 py-0.5 mt-0.5 rounded-full bg-primary/10 text-primary font-label-caps text-[10px] uppercase font-semibold tracking-wide">
                ★ Master
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Version */}
      <td className="py-4 px-6">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps border border-outline-variant/50">
          {cv.version}
        </span>
      </td>

      {/* Uploaded Date */}
      <td className="py-4 px-6">
        <span className="font-body-md text-body-md text-on-surface-variant">
          {cv.uploadedDate}
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

export default function MyCVsPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

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

  const stats = {
    total: mockCVs.length,
    ready: mockCVs.filter((c) => c.status === "Ready").length,
    processing: mockCVs.filter((c) => c.status === "Processing").length,
    failed: mockCVs.filter((c) => c.status === "Failed").length,
  };

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
          {[
            { label: "Total CVs", value: stats.total, icon: "folder_open", color: "text-primary bg-primary/8" },
            { label: "Ready", value: stats.ready, icon: "check_circle", color: "text-emerald-600 bg-emerald-50" },
            { label: "Processing", value: stats.processing, icon: "sync", color: "text-amber-600 bg-amber-50" },
            { label: "Failed", value: stats.failed, icon: "error_outline", color: "text-red-600 bg-red-50" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-4 flex items-center gap-3"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${stat.color}`}>
                <span className="material-symbols-outlined text-[18px]">{stat.icon}</span>
              </div>
              <div>
                <p className="font-stat-lg text-[22px] font-semibold text-on-surface leading-none">
                  {stat.value}
                </p>
                <p className="font-label-caps text-label-caps text-on-surface-variant mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
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
                {mockCVs.map((cv) => (
                  <CVRow
                    key={cv.id}
                    cv={cv}
                    onMenuClick={(id) =>
                      setActiveMenu(activeMenu === id ? null : id)
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Card Footer */}
          <div className="px-6 py-3 border-t border-outline-variant/30 flex items-center justify-between">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Showing {mockCVs.length} of {mockCVs.length} documents
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
