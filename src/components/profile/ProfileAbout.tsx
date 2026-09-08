import { AlignLeft } from "lucide-react";

interface ProfileAboutProps {
  bio: string;
}

export default function ProfileAbout({ bio }: ProfileAboutProps) {
  return (
    <div className="w-full rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between border-b border-outline-variant/40 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">About you</p>
          <h3 className="mt-1 text-[20px] font-[600] text-on-surface">Bio</h3>
        </div>
        <AlignLeft className="h-5 w-5 text-on-surface-variant" />
      </div>
      <div className="max-w-3xl whitespace-pre-wrap text-[14px] leading-7 text-on-surface-variant">
        {bio ? (
          <p>{bio}</p>
        ) : (
          <p className="italic text-outline">No bio provided yet.</p>
        )}
      </div>
    </div>
  );
}
