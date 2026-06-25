import Foundation

enum MockLearningData {
    static let letters: [LetterItem] = ["A", "B", "C", "D", "E"].map { LetterItem(symbol: $0) }

    static let animals: [AnimalItem] = [
        AnimalItem(name: "Lion", emoji: "🦁", soundPrompt: "Roar"),
        AnimalItem(name: "Dog", emoji: "🐶", soundPrompt: "Woof"),
        AnimalItem(name: "Cat", emoji: "🐱", soundPrompt: "Meow"),
        AnimalItem(name: "Bird", emoji: "🐦", soundPrompt: "Tweet")
    ]

    static let miniGames: [MiniGameItem] = [
        MiniGameItem(id: .bubblePop, title: "Bubble Pop", emoji: "🫧"),
        MiniGameItem(id: .feedMonster, title: "Feed the Monster", emoji: "👾"),
        MiniGameItem(id: .fishingLetters, title: "Drag Letters", emoji: "🔤"),
        MiniGameItem(id: .catchStar, title: "Catch the Fish", emoji: "🐠")
    ]

    static let encouragementFallbacks = [
        "Yay! Great job!",
        "Wonderful!",
        "You did it!",
        "So good!"
    ]
}
