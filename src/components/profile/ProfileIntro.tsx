export default function ProfileIntro() {
  return (
    <div className="lg:col-span-7 bg-surface-container-lowest border border-surface-variant rounded-xl p-8 shadow-sm flex flex-col">
      <h3 className="font-headline-md text-headline-md text-on-surface mb-6 border-b border-surface-variant pb-4">
        Intro
      </h3>
      <div className="flex-1 flex flex-col gap-6">
        {/* Email Field */}
        <div className="group">
          <label className="font-label-caps text-label-caps text-secondary mb-2 block uppercase tracking-wider">
            Email Address
          </label>
          <div className="flex items-center justify-between p-4 bg-surface-bright rounded-lg border border-transparent group-hover:border-surface-variant transition-colors">
            <span className="font-body-md text-body-md text-on-surface">
              alex@example.com
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-fixed text-primary-fixed-variant rounded-full font-label-caps text-label-caps">
              <span className="material-symbols-outlined text-[16px]" data-icon="check_circle">
                check_circle
              </span>
              Verified
            </div>
          </div>
        </div>
        {/* Phone Number Field */}
        <div className="group">
          <label className="font-label-caps text-label-caps text-secondary mb-2 block uppercase tracking-wider">
            Phone Number
          </label>
          <div className="flex items-center justify-between p-4 bg-surface-bright rounded-lg border border-transparent group-hover:border-surface-variant transition-colors">
            <span className="font-body-md text-body-md text-on-surface">
              +1 (555) 000-0000
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-fixed text-primary-fixed-variant rounded-full font-label-caps text-label-caps">
              <span className="material-symbols-outlined text-[16px]" data-icon="check_circle">
                check_circle
              </span>
              Verified
            </div>
          </div>
        </div>
        {/* Joined At Field */}
        <div className="group">
          <label className="font-label-caps text-label-caps text-secondary mb-2 block uppercase tracking-wider">
            Joined At
          </label>
          <div className="flex items-center p-4 bg-surface-bright rounded-lg border border-transparent group-hover:border-surface-variant transition-colors">
            <span className="font-body-md text-body-md text-on-surface">
              October 24, 2023
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
