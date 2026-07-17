interface SettingItemProps {
  title: string;
  value?: string;
  buttonText: string;
  onClick?: () => void;
}

export default function SettingItem({ title, value, buttonText, onClick }: SettingItemProps) {
  return (
    <div className="flex justify-between items-center py-5 border-b border-surface-variant last:border-0">
      <div className="flex flex-col">
        <span className="font-title-sm text-title-sm font-bold text-on-surface">{title}</span>
        {value && <span className="font-body-md text-body-md text-secondary mt-1">{value}</span>}
      </div>
      <button 
        onClick={onClick}
        className="px-4 py-2 bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low text-on-surface font-label-caps text-label-caps rounded-lg transition-colors cursor-pointer shadow-sm"
      >
        {buttonText}
      </button>
    </div>
  );
}
