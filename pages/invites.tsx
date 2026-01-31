import { InviteSection } from "@/components/InviteSection";
import { Navigation } from "@/components/navigation";

export default function InvitesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Invite Friends
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Share your invite link and earn 100 Points for every friend who joins!
          </p>
        </div>
        <InviteSection />
      </main>
    </div>
  );
}