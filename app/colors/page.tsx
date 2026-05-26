import { ColorsLesson } from "@/components/ColorsLesson";
import { PageIntro } from "@/components/PageIntro";

export default function ColorsPage() {
  return (
    <div className="page-pad">
      <PageIntro eyebrow="Color garden" title="Say each color">
        Press play to hear every color and connect it with a simple everyday example.
      </PageIntro>
      <div className="mt-10">
        <ColorsLesson />
      </div>
    </div>
  );
}
