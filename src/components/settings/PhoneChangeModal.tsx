export default function PhoneChangeModal({
  onClose,
  onVerify,
}: {
  onClose: () => void;
  onVerify: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-modal-backdrop">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-sm overflow-hidden border border-outline-variant animate-modal-content">
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-primary text-[24px]">
              phone
            </span>
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
            Phone Number Change
          </h2>
          <p className="font-body-md text-body-md text-secondary mb-6">
            Enter your new phone number to receive a verification code.
          </p>
          <div className="w-full space-y-4">
            <div className="text-left">
              <label className="font-label-caps text-label-caps text-secondary mb-1 block">
                New Phone Number
              </label>
              <input
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors font-body-md text-body-md bg-surface"
                placeholder="+1 (555) 000-0000"
                type="tel"
              />
            </div>
            <button
              onClick={onVerify}
              className="w-full py-3 bg-primary text-on-primary rounded-lg font-title-sm text-title-sm hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm focus:ring-2 focus:ring-primary/50 outline-none cursor-pointer"
            >
              Verify
            </button>
          </div>
        </div>
        <div className="bg-surface-container-low px-6 py-4 flex justify-end border-t border-outline-variant">
          <button
            onClick={onClose}
            className="font-label-caps text-label-caps text-secondary hover:text-on-surface transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
