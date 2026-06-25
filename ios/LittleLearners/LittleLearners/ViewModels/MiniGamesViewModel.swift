import Foundation

@MainActor
final class MiniGamesViewModel: ObservableObject {
    @Published var activeGame: MiniGameKind = .bubblePop
    @Published var targetLetterIndex = 0
    @Published var wrongLetter: String?

    func targetLetter(for language: AppLanguage) -> LetterItem {
        let letters = MockLearningData.letters(for: language)
        return letters[(targetLetterIndex * 7) % letters.count]
    }

    func letterChoices(for language: AppLanguage) -> [String] {
        let letters = MockLearningData.letters(for: language).map(\.symbol)
        let index = (targetLetterIndex * 7) % letters.count
        return [
            letters[index],
            letters[(index + targetLetterIndex * 3 + 5) % letters.count],
            letters[(index + targetLetterIndex * 5 + 11) % letters.count]
        ]
    }

    func select(_ game: MiniGameKind) {
        activeGame = game
        wrongLetter = nil
    }

    func reward(app: AppViewModel) {
        Task {
            await app.reward {
                self.targetLetterIndex += 1
            }
        }
    }

    func retry(letter: String, app: AppViewModel) {
        wrongLetter = letter
        app.wrongAnswer()
        Task {
            try? await Task.sleep(for: .milliseconds(520))
            if wrongLetter == letter {
                wrongLetter = nil
            }
        }
    }
}
