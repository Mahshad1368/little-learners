import { PageIntro } from "@/components/PageIntro";
import { ShapesLesson } from "@/components/ShapesLesson";

export default function ShapesPage() {
  return (
    <div className="page-pad">
      <PageIntro eyebrow="Shape studio" title="Find friendly shapes">
        Learn circles, squares, triangles, and rectangles with bright animated cards.
      </PageIntro>
      <div className="mt-10">
        <ShapesLesson />
      </div>
    </div>
  );
}
