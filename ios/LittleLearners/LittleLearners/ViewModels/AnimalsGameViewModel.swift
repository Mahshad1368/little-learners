import Foundation

@MainActor
final class AnimalsGameViewModel: ObservableObject {
    @Published var round = 0
    @Published var tokens: [FloatingToken] = []
    @Published var wrongTokenID: UUID?

    var target: AnimalItem {
        MockLearningData.animals[round % MockLearningData.animals.count]
    }

    func startRound() {
        let animals = rotatedAnimals()
        tokens = animals.enumerated().map { index, item in
            FloatingToken(
                label: item.name,
                emoji: item.emoji,
                x: 0,
                y: 0,
                scale: item.name == target.name ? 1.10 : 1.0,
                driftX: Double([18, -20, 16, -16][index % 4]),
                driftY: Double([20, 16, -18, 22][index % 4]),
                duration: 2.5 + Double(index) * 0.2
            )
        }
    }

    func choose(_ token: FloatingToken, app: AppViewModel) {
        guard token.label == target.name else {
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
                await app.voiceQueue.playInstruction(parentClip: app.instructionClip, action: "Find", target: self.target.name)
            }
        }
    }

    private func rotatedAnimals() -> [AnimalItem] {
        let animals = MockLearningData.animals
        let start = round % animals.count
        return Array(animals[start...]) + Array(animals[..<start])
    }
}
