import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex justify-between items-center px-container-padding w-full h-16 mt-auto bg-surface border-t border-outline-variant">
      <div className="flex items-center gap-4">
        <span className="font-label-caps text-label-caps text-primary uppercase">applica</span>
        <span className="font-body-sm text-body-sm text-secondary">
          © 2024 applica. Minimal automation.
        </span>
      </div>
      <div className="flex gap-6">
        <Link href="#" className="font-body-sm text-body-sm text-secondary hover:text-primary transition-colors">
          Privacy
        </Link>
        <Link href="#" className="font-body-sm text-body-sm text-secondary hover:text-primary transition-colors">
          Terms
        </Link>
        <Link href="#" className="font-body-sm text-body-sm text-secondary hover:text-primary transition-colors">
          Support
        </Link>
      </div>
    </footer>
  );
}
