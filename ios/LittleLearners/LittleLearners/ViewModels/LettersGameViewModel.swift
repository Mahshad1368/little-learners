import Foundation

@MainActor
final class LettersGameViewModel: ObservableObject {
    @Published var round = 0
    @Published var tokens: [FloatingToken] = []
    @Published var wrongTokenID: UUID?

    var target: LetterItem {
        MockLearningData.letters[round % MockLearningData.letters.count]
    }

    func startRound() {
        let symbols = rotatedLetters()
        tokens = symbols.enumerated().map { index, item in
            FloatingToken(
                label: item.symbol,
                emoji: nil,
                x: 0,
                y: 0,
                scale: item.symbol == target.symbol ? 1.12 : 1.0,
                driftX: Double([16, -18, 22, -14, 18][index % 5]),
                driftY: Double([22, 18, -20, 24, -18][index % 5]),
                duration: 2.3 + Double(index) * 0.18
            )
        }
    }

    func choose(_ token: FloatingToken, app: AppViewModel) {
        guard token.label == target.symbol else {
            wrongTokenID = token.id
            app.wrongAnswer()
            Task {
                try? await Task.sleep(for: .milliseconds(520))
                if wrongTokenID == token.id {
                    wrongTokenID = nil
                }
            }
            return
        }

        Task {
            await app.reward {
                self.round += 1
                self.startRound()
                await app.voiceQueue.playInstruction(parentClip: app.instructionClip, action: "Catch", target: self.target.symbol)
            }
        }
    }

    private func rotatedLetters() -> [LetterItem] {
        let letters = MockLearningData.letters
        let start = round % letters.count
        return Array(letters[start...]) + Array(letters[..<start])
    }
}
