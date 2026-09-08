import { Users, Activity, ShieldCheck, ArrowUpRight } from "lucide-react";

const stats = [
  { label: "Total users", value: "1,248", change: "+12.4%", icon: Users },
  { label: "Active today", value: "386", change: "+8.1%", icon: Activity },
  { label: "Staff members", value: "24", change: "+2 new", icon: ShieldCheck },
];

export default function AdminPage() {
  return (
    <main className="flex-grow bg-background p-container-padding">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
              Operations
            </p>
            <h2 className="mt-2 font-display-lg text-display-lg text-on-background">
              Admin overview
            </h2>
            <p className="mt-2 max-w-xl text-body-md text-secondary">
              Keep an eye on the people and activity powering applica.
            </p>
          </div>
          <button className="flex items-center gap-2 self-start rounded-lg bg-primary px-4 py-3 text-sm font-bold text-on-primary transition-colors hover:bg-primary-container md:self-auto">
            View reports
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map(({ label, value, change, icon: Icon }) => (
            <article key={label} className="border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold text-primary">{change}</span>
              </div>
              <p className="mt-6 text-sm text-secondary">{label}</p>
              <p className="mt-1 text-3xl font-bold text-on-background">{value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <div className="border border-outline-variant bg-surface-container-lowest p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-title-lg text-on-background">Recent activity</h3>
                <p className="mt-1 text-sm text-secondary">The latest changes across the workspace.</p>
              </div>
              <button className="text-sm font-bold text-primary hover:underline">See all</button>
            </div>
            <div className="mt-6 divide-y divide-outline-variant">
              {[
                ["New staff member added", "Maya Singh joined the operations team", "12 min ago"],
                ["Profile review completed", "A user profile was approved", "38 min ago"],
                ["System settings updated", "Notification preferences were changed", "1 hr ago"],
              ].map(([title, detail, time]) => (
                <div key={title} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-on-background">{title}</p>
                    <p className="mt-1 truncate text-sm text-secondary">{detail}</p>
                  </div>
                  <span className="shrink-0 text-xs text-secondary">{time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-outline-variant bg-surface-container-lowest p-6">
            <h3 className="text-title-lg text-on-background">Access summary</h3>
            <p className="mt-1 text-sm text-secondary">Current account distribution.</p>
            <div className="mt-6 space-y-5">
              {[
                ["User accounts", "92%", "bg-primary"],
                ["Staff accounts", "6%", "bg-tertiary"],
                ["Admin accounts", "2%", "bg-error"],
              ].map(([label, percentage, color]) => (
                <div key={label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-secondary">{label}</span>
                    <span className="font-bold text-on-background">{percentage}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-container">
                    <div className={`h-full ${color}`} style={{ width: percentage }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}