import { LettersLesson } from "@/components/LettersLesson";
import { PageIntro } from "@/components/PageIntro";

export default function LettersPage() {
  return (
    <div className="page-pad">
      <PageIntro eyebrow="Alphabet adventure" title="Meet every letter">
        Tap play to hear the sound, then explore the picture clue on each card.
      </PageIntro>
      <div className="mt-10">
        <LettersLesson />
      </div>
    </div>
  );
}
