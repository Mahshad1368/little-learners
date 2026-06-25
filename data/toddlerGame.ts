export const toddlerLetters = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

export const cheers = ["Yay!", "Awesome!", "Great job!", "Amazing!"] as const;

export const mascotFaces = {
  calm: "🐻",
  happy: "🥳",
  sparkle: "🤩"
} as const;

export const toddlerAnimals = [
  { name: "Lion", emoji: "🦁", sound: "Roar!" },
  { name: "Dog", emoji: "🐶", sound: "Woof woof!" },
  { name: "Cat", emoji: "🐱", sound: "Meow!" },
  { name: "Cow", emoji: "🐮", sound: "Moooo!" },
  { name: "Duck", emoji: "🦆", sound: "Quack quack!" },
  { name: "Monkey", emoji: "🐵", sound: "Ooh ooh!" }
] as const;

export const miniGames = [
  { id: "bubbles", title: "Bubble Pop", emoji: "🫧" },
  { id: "fishing", title: "Drag Letters", emoji: "🔤" },
  { id: "star", title: "Catch Fish", emoji: "🐠" }
] as const;
