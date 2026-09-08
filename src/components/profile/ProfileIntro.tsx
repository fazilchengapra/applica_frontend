import { CalendarDays, CheckCircle2, Mail, Phone } from "lucide-react";

interface ProfileIntroProps {
  email: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  dateJoined: string | null;
}

export default function ProfileIntro({
  email,
  phoneNumber,
  isEmailVerified,
  isPhoneVerified,
  dateJoined,
}: ProfileIntroProps) {
  const formattedJoined = dateJoined
    ? new Date(dateJoined).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Unknown';

  return (
    <div className="flex flex-col rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-sm lg:col-span-7">
      <div className="mb-5 flex items-center justify-between border-b border-outline-variant/40 pb-4">
        <div>
          <p className="font-label-caps text-label-caps font-semibold uppercase tracking-[0.14em] text-primary">Contact</p>
          <h3 className="mt-1 text-[20px] font-[600] text-on-surface">Profile details</h3>
        </div>
        <Mail className="h-5 w-5 text-on-surface-variant" />
      </div>
      <div className="flex-1 flex flex-col gap-6">
        {/* Email Field */}
        <div className="group">
          <label className="mb-2 block font-label-caps text-label-caps uppercase tracking-wider text-secondary">
            Email Address
          </label>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-transparent bg-surface-bright p-3.5 transition-colors group-hover:border-surface-variant">
            <span className="flex min-w-0 items-center gap-2 truncate text-[14px] text-on-surface">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              {email || 'Not provided'}
            </span>
            {isEmailVerified && (
              <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-label-caps text-label-caps text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </div>
            )}
          </div>
        </div>
        {/* Phone Number Field */}
        <div className="group">
          <label className="mb-2 block font-label-caps text-label-caps uppercase tracking-wider text-secondary">
            Phone Number
          </label>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-transparent bg-surface-bright p-3.5 transition-colors group-hover:border-surface-variant">
            <span className="flex min-w-0 items-center gap-2 truncate text-[14px] text-on-surface">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              {phoneNumber || 'Not provided'}
            </span>
            {isPhoneVerified && (
              <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-label-caps text-label-caps text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </div>
            )}
          </div>
        </div>
        {/* Joined At Field */}
        <div className="group">
          <label className="mb-2 block font-label-caps text-label-caps uppercase tracking-wider text-secondary">
            Joined At
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-transparent bg-surface-bright p-3.5 transition-colors group-hover:border-surface-variant">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="text-[14px] text-on-surface">
              {formattedJoined}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
