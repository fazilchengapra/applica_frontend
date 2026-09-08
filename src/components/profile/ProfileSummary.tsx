import Image from "next/image";
import { CalendarDays, UserRound } from "lucide-react";

interface ProfileSummaryProps {
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl: string;
  dateOfBirth: string | null;
}

export default function ProfileSummary({
  firstName,
  lastName,
  displayName,
  avatarUrl,
  dateOfBirth,
}: ProfileSummaryProps) {
  const nameToDisplay = displayName || `${firstName} ${lastName}` || "User";
  const avatar = avatarUrl || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" // Fallback to current placeholder if empty

  const formattedDate = dateOfBirth
    ? new Date(dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Not provided';

  return (
    <div className="relative flex flex-col items-center overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 text-center shadow-sm lg:col-span-5">
      <div className="absolute inset-x-0 top-0 h-24 bg-primary/8" />
      <div className="relative mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-surface-container-high shadow-md">
        {avatarUrl ? (
          <Image alt={`${nameToDisplay} profile picture`} className="h-full w-full object-cover" src={avatar} width={112} height={112} unoptimized />
        ) : (
          <UserRound className="h-10 w-10 text-primary" />
        )}
      </div>
      <h2 className="text-[22px] font-[600] text-on-surface">{nameToDisplay}</h2>
      <p className="mt-1 text-[14px] text-on-surface-variant">@{firstName.toLowerCase() || 'user'}</p>
      <div className="mt-6 flex w-full items-center justify-center gap-2 border-t border-outline-variant/40 pt-4 text-[13px] text-on-surface-variant">
        <CalendarDays className="h-4 w-4 text-primary" />
        <span>Born {formattedDate}</span>
      </div>
    </div>
  );
}
