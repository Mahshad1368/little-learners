export interface LetterItem {
  id: string;
  letter: string;
  word: string;
  emoji: string;
  sound: string;
}

export interface ShapeItem {
  id: string;
  name: string;
  description: string;
  className: string;
  colorClass: string;
}

export interface ColorItem {
  id: string;
  name: string;
  hex: string;
  example: string;
}

export interface GameItem {
  id: string;
  letter: string;
  word: string;
  emoji: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  accent: string;
}

export interface ActivityItem {
  title: string;
  detail: string;
  progress: number;
  accent: string;
}
