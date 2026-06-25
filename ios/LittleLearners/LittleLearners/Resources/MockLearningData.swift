import Foundation

enum MockLearningData {
    static func letters(for language: AppLanguage) -> [LetterItem] {
        language.letters
    }

    static func animals(for language: AppLanguage) -> [AnimalItem] {
        language.animals
    }

    static func miniGames(for language: AppLanguage) -> [MiniGameItem] {
        language.miniGames
    }

    static let encouragementFallbacks = [
        "Yay! Great job!",
        "Wonderful!",
        "You did it!",
        "So good!"
    ]
}
