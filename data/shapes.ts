import type { ShapeItem } from "@/types/learning";

export const shapes: ShapeItem[] = [
  {
    id: "circle",
    name: "Circle",
    description: "A circle is round with no corners.",
    className: "rounded-full aspect-square",
    colorClass: "bg-berry"
  },
  {
    id: "square",
    name: "Square",
    description: "A square has four equal sides.",
    className: "rounded-2xl aspect-square",
    colorClass: "bg-sky"
  },
  {
    id: "triangle",
    name: "Triangle",
    description: "A triangle has three sides and three corners.",
    className: "triangle-shape",
    colorClass: "bg-banana"
  },
  {
    id: "rectangle",
    name: "Rectangle",
    description: "A rectangle has two long sides and two short sides.",
    className: "rounded-2xl aspect-[4/3]",
    colorClass: "bg-leaf"
  }
];
