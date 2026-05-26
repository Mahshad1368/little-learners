import type { ActivityItem, DashboardMetric } from "@/types/learning";

export const dashboardMetrics: DashboardMetric[] = [
  { label: "Completed lessons", value: "18", accent: "bg-berry" },
  { label: "Total score", value: "740", accent: "bg-banana" },
  { label: "Learning streak", value: "6 days", accent: "bg-leaf" }
];

export const activityItems: ActivityItem[] = [
  { title: "Letters", detail: "A through M practiced", progress: 62, accent: "bg-berry" },
  { title: "Shapes", detail: "4 shapes discovered", progress: 100, accent: "bg-sky" },
  { title: "Colors", detail: "5 colors named", progress: 70, accent: "bg-leaf" },
  { title: "Games", detail: "3 matching rounds won", progress: 48, accent: "bg-plum" }
];
