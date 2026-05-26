import { GamesLesson } from "@/components/GamesLesson";
import { PageIntro } from "@/components/PageIntro";

export default function GamesPage() {
  return (
    <div className="page-pad">
      <PageIntro eyebrow="Play and practice" title="Match letters to pictures">
        Pick a letter, choose the picture that starts with it, and earn points.
      </PageIntro>
      <div className="mt-10">
        <GamesLesson />
      </div>
    </div>
  );
}
