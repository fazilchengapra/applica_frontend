import Image from "next/image";

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
    <div className="lg:col-span-5 bg-surface-container-lowest border border-surface-variant rounded-xl p-8 flex flex-col items-center text-center shadow-sm relative overflow-hidden group">
      {/* Subtle decorative background element */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-primary-fixed rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
      <div className="relative w-32 h-32 rounded-full bg-surface-container-high overflow-hidden mb-6 border-4 border-surface shadow-md">
        <Image
          alt={`${nameToDisplay} profile picture`}
          className="w-full h-full object-cover"
          src={avatar}
          width={128}
          height={128}
          unoptimized
        />
      </div>
      <h2 className="font-headline-md text-headline-md text-on-surface mb-1">{nameToDisplay}</h2>
      <p className="font-body-md text-body-md text-secondary mb-4">@{firstName.toLowerCase() || 'user'}</p>
      <div className="mt-auto w-full pt-6 border-t border-surface-variant flex flex-col items-center">
        <span className="font-label-caps text-label-caps text-tertiary mb-1 uppercase tracking-wider">
          Date of Birth
        </span>
        <span className="font-title-sm text-title-sm text-on-surface">{formattedDate}</span>
      </div>
    </div>
  );
}
