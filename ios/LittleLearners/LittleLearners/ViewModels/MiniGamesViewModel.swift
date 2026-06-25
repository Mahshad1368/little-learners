import Foundation

@MainActor
final class MiniGamesViewModel: ObservableObject {
    @Published var activeGame: MiniGameKind = .bubblePop
    @Published var targetLetterIndex = 0
    @Published var wrongLetter: String?

    var targetLetter: LetterItem {
        MockLearningData.letters[targetLetterIndex % MockLearningData.letters.count]
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
