import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Send,
  Sparkles,
} from "lucide-react";

export default function StatsGrid() {
  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Applications sent", value: "24", note: "+6 this week", icon: Send, color: "text-primary bg-primary/10" },
          { label: "Interview invites", value: "5", note: "+2 this week", icon: CalendarDays, color: "text-emerald-700 bg-emerald-50" },
          { label: "Saved opportunities", value: "18", note: "4 new matches", icon: BriefcaseBusiness, color: "text-amber-700 bg-amber-50" },
          { label: "CV readiness", value: "82%", note: "Strong profile", icon: Sparkles, color: "text-violet-700 bg-violet-50" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-outline" />
            </div>
            <p className="mt-5 text-[28px] font-[600] leading-8 text-on-surface">{stat.value}</p>
            <p className="mt-1 text-[13px] font-semibold text-on-surface">{stat.label}</p>
            <p className="mt-1 text-[12px] text-emerald-700">{stat.note}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-primary">This week</p>
              <h3 className="mt-1 text-[20px] font-[600] text-on-surface">Application activity</h3>
            </div>
            <span className="text-[13px] text-on-surface-variant">24 total</span>
          </div>
          <div className="mt-7 flex h-40 items-end justify-between gap-3 border-b border-outline-variant/40 px-2">
            {[3, 5, 2, 7, 4, 8, 6].map((value, index) => (
              <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div className="w-full max-w-10 rounded-t-md bg-primary/80 transition-colors hover:bg-primary" style={{ height: `${value * 10}%` }} />
                <span className="mb-[-22px] text-[11px] text-on-surface-variant">{["M", "T", "W", "T", "F", "S", "S"][index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-primary">Next steps</p>
              <h3 className="mt-1 text-[20px] font-[600] text-on-surface">Upcoming applications</h3>
            </div>
            <FileText className="h-5 w-5 text-on-surface-variant" />
          </div>
          <div className="mt-5 flex flex-col divide-y divide-outline-variant/30">
            {[
              { company: "Northstar Labs", role: "Frontend Developer", date: "Today" },
              { company: "Brightline", role: "Product Designer", date: "Tomorrow" },
              { company: "Vertex Systems", role: "React Engineer", date: "Fri, Sep 12" },
            ].map((item) => (
              <div key={item.company} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container text-primary">
                  <Clock3 className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-on-surface">{item.role}</p>
                  <p className="truncate text-[12px] text-on-surface-variant">{item.company}</p>
                </div>
                <span className="shrink-0 text-[12px] font-semibold text-primary">{item.date}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 text-[13px] font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Your week is on track
          </div>
        </div>
      </section>
    </div>
  );
}
