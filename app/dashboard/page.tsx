import { DashboardView } from "@/components/DashboardView";
import { PageIntro } from "@/components/PageIntro";

export default function DashboardPage() {
  return (
    <div className="page-pad">
      <PageIntro eyebrow="Parent dashboard" title="Learning at a glance">
        Track lesson completion, total score, practice habits, and growth across activities.
      </PageIntro>
      <div className="mt-10">
        <DashboardView />
      </div>
    </div>
  );
}
