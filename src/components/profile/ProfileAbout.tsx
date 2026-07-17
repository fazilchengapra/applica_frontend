interface ProfileAboutProps {
  bio: string;
}

export default function ProfileAbout({ bio }: ProfileAboutProps) {
  return (
    <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-8 shadow-sm w-full">
      <div className="flex justify-between items-center mb-6 border-b border-surface-variant pb-4">
        <h3 className="font-headline-md text-headline-md text-on-surface">About</h3>
        <button className="text-secondary hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-bright cursor-pointer">
          <span className="material-symbols-outlined" data-icon="edit">
            edit
          </span>
        </button>
      </div>
      <div className="prose prose-sm max-w-none text-on-surface-variant font-body-md text-body-md leading-relaxed whitespace-pre-wrap">
        {bio ? (
          <p>{bio}</p>
        ) : (
          <p className="italic text-outline">No bio provided yet.</p>
        )}
      </div>
    </div>
  );
}
