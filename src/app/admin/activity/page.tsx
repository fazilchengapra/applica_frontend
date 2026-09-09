import { Download } from "lucide-react";

const events = [
  {
    id: 1,
    type: "user_joined",
    icon: "person_add",
    iconColor: "bg-emerald-100 text-emerald-700",
    title: "New user registered",
    detail: "Sofia Reyes created an account via email.",
    user: "Sofia Reyes",
    time: "2 min ago",
    date: "Sep 8, 2026",
  },
  {
    id: 2,
    type: "staff_added",
    icon: "shield_person",
    iconColor: "bg-primary/10 text-primary",
    title: "Staff member added",
    detail: "Maya Singh was promoted to Staff by James Obi.",
    user: "James Obi",
    time: "14 min ago",
    date: "Sep 8, 2026",
  },
  {
    id: 3,
    type: "cv_approved",
    icon: "task_alt",
    iconColor: "bg-blue-100 text-blue-700",
    title: "CV review completed",
    detail: "Liam Carter's profile CV was approved.",
    user: "Liam Carter",
    time: "38 min ago",
    date: "Sep 8, 2026",
  },
  {
    id: 4,
    type: "settings_changed",
    icon: "settings",
    iconColor: "bg-amber-100 text-amber-700",
    title: "System settings updated",
    detail: "Notification preferences were changed for all users.",
    user: "James Obi",
    time: "1 hr ago",
    date: "Sep 8, 2026",
  },
  {
    id: 5,
    type: "user_suspended",
    icon: "block",
    iconColor: "bg-error/10 text-error",
    title: "Account suspended",
    detail: "Amara Osei's account was suspended for policy violations.",
    user: "James Obi",
    time: "3 hr ago",
    date: "Sep 8, 2026",
  },
  {
    id: 6,
    type: "user_joined",
    icon: "person_add",
    iconColor: "bg-emerald-100 text-emerald-700",
    title: "New user registered",
    detail: "Ethan Brooks created an account via Google.",
    user: "Ethan Brooks",
    time: "5 hr ago",
    date: "Sep 8, 2026",
  },
  {
    id: 7,
    type: "cv_approved",
    icon: "task_alt",
    iconColor: "bg-blue-100 text-blue-700",
    title: "CV review completed",
    detail: "Noah Kim's Master CV was approved and published.",
    user: "Noah Kim",
    time: "Yesterday",
    date: "Sep 7, 2026",
  },
  {
    id: 8,
    type: "password_reset",
    icon: "lock_reset",
    iconColor: "bg-violet-100 text-violet-700",
    title: "Password reset requested",
    detail: "Priya Nair requested a password reset link.",
    user: "Priya Nair",
    time: "Yesterday",
    date: "Sep 7, 2026",
  },
  {
    id: 9,
    type: "staff_added",
    icon: "shield_person",
    iconColor: "bg-primary/10 text-primary",
    title: "Staff member added",
    detail: "Noah Kim was promoted to Staff by James Obi.",
    user: "James Obi",
    time: "2 days ago",
    date: "Sep 6, 2026",
  },
  {
    id: 10,
    type: "settings_changed",
    icon: "settings",
    iconColor: "bg-amber-100 text-amber-700",
    title: "Email templates updated",
    detail: "Welcome email template was revised.",
    user: "Maya Singh",
    time: "2 days ago",
    date: "Sep 6, 2026",
  },
];

const stats = [
  { label: "Events today", value: "6" },
  { label: "This week", value: "34" },
  { label: "This month", value: "148" },
];

const typeLabel: Record<string, string> = {
  user_joined: "bg-emerald-50 text-emerald-700 border-emerald-200",
  staff_added: "bg-primary/10 text-primary border-primary/20",
  cv_approved: "bg-blue-50 text-blue-700 border-blue-200",
  settings_changed: "bg-amber-50 text-amber-700 border-amber-200",
  user_suspended: "bg-error/10 text-error border-error/20",
  password_reset: "bg-violet-50 text-violet-700 border-violet-200",
};

const typeText: Record<string, string> = {
  user_joined: "Registration",
  staff_added: "Promotion",
  cv_approved: "CV Review",
  settings_changed: "Settings",
  user_suspended: "Moderation",
  password_reset: "Security",
};

// Group events by date
const grouped = events.reduce<Record<string, typeof events>>((acc, e) => {
  if (!acc[e.date]) acc[e.date] = [];
  acc[e.date].push(e);
  return acc;
}, {});

export default function AdminActivityPage() {
  return (
    <main className="flex-grow bg-background p-container-padding">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
              Audit
            </p>
            <h2 className="mt-2 font-display-lg text-display-lg text-on-background">
              Activity log
            </h2>
            <p className="mt-2 text-sm text-secondary">
              A chronological record of all platform events and actions.
            </p>
          </div>
          <button className="flex items-center gap-2 self-start rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-background transition-colors hover:bg-surface-container md:self-auto">
            <Download className="h-4 w-4" />
            Export log
          </button>
        </header>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-on-background">{value}</p>
              <p className="mt-0.5 text-xs text-secondary">{label}</p>
            </div>
          ))}
        </div>

        {/* Timeline grouped by date */}
        <div className="space-y-8">
          {Object.entries(grouped).map(([date, dayEvents]) => (
            <div key={date}>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-secondary">{date}</p>
              <div className="relative space-y-0">
                {/* Vertical line */}
                <div className="absolute left-[19px] top-0 h-full w-px bg-outline-variant" aria-hidden />

                {dayEvents.map((event, idx) => (
                  <div key={event.id} className={`relative flex gap-4 ${idx < dayEvents.length - 1 ? "pb-6" : ""}`}>
                    {/* Icon */}
                    <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-surface-container-lowest ${event.iconColor}`}>
                      <span className="material-symbols-outlined text-[18px]">{event.icon}</span>
                    </div>

                    {/* Content card */}
                    <div className="min-w-0 flex-1 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-on-background">{event.title}</p>
                            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${typeLabel[event.type]}`}>
                              {typeText[event.type]}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-secondary">{event.detail}</p>
                        </div>
                        <span className="shrink-0 text-xs text-secondary">{event.time}</span>
                      </div>
                      <p className="mt-2 text-xs text-secondary">
                        By <span className="font-medium text-on-background">{event.user}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className="flex justify-center">
          <button className="rounded-lg border border-outline-variant px-6 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-surface-container">
            Load more events
          </button>
        </div>

      </div>
    </main>
  );
}
