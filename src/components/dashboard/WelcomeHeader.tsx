export default function WelcomeHeader() {
  return (
    <div className="flex justify-between items-end mb-8">
      <div>
        <h2 className="font-display-lg text-display-lg text-on-surface tracking-tight">
          Welcome, Alex
        </h2>
        <p className="font-body-md text-body-md text-secondary">
          Here's what's happening with your job automation today.
        </p>
      </div>
      <div className="flex gap-2">
        {/* Additional header actions can be added here */}
      </div>
    </div>
  );
}
