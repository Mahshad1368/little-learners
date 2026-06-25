import Foundation

@MainActor
final class AnimalsGameViewModel: ObservableObject {
    @Published var round = 0
    @Published var tokens: [FloatingToken] = []
    @Published var wrongTokenID: UUID?

    func target(for language: AppLanguage) -> AnimalItem {
        let animals = MockLearningData.animals(for: language)
        return animals[round % animals.count]
    }

    func startRound(language: AppLanguage) {
        let currentTarget = target(for: language)
        let animals = rotatedAnimals(language: language)
        let targetIndex = animals.firstIndex(where: { $0.name == currentTarget.name }) ?? 0
        tokens = animals.enumerated().map { index, item in
            let isTarget = item.name == currentTarget.name
            let anchor = Self.anchor(for: index, targetIndex: targetIndex, round: round, kindOffset: 4)
            let motion = Self.motion(for: index, round: round, isTarget: isTarget)
            return FloatingToken(
                label: item.name,
                emoji: item.emoji,
                x: anchor.x,
                y: anchor.y,
                scale: isTarget ? 1.18 : 0.92,
                driftX: motion.x,
                driftY: motion.y,
                duration: motion.duration,
                colorHue: motion.hue
            )
        }
    }

    func choose(_ token: FloatingToken, app: AppViewModel) {
        guard token.label == target(for: app.language).name else {
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
                self.startRound(language: app.language)
                let nextTarget = self.target(for: app.language)
                await app.voiceQueue.playAnimalInstruction(action: app.language.copy.findWord, animal: nextTarget, language: app.language)
                app.soundEffects.playAnimalSound(nextTarget.soundPrompt)
            }
        }
    }

    private func rotatedAnimals(language: AppLanguage) -> [AnimalItem] {
        let animals = MockLearningData.animals(for: language)
        let start = round % animals.count
        return Array(animals[start...]) + Array(animals[..<start])
    }

    private static func anchor(for index: Int, targetIndex: Int, round: Int, kindOffset: Int) -> (x: Double, y: Double) {
        let anchors: [(Double, Double)] = [
            (0.78, 0.24),
            (0.20, 0.34),
            (0.70, 0.50),
            (0.30, 0.64),
            (0.58, 0.80),
            (0.84, 0.72),
            (0.18, 0.78)
        ]
        var targetAnchorIndex = (round * 5 + targetIndex * 3 + kindOffset) % anchors.count
        let previousTarget = anchors[((round - 1) * 5 + targetIndex * 3 + kindOffset + anchors.count) % anchors.count]
        let candidate = anchors[targetAnchorIndex]
        if abs(candidate.0 - previousTarget.0) + abs(candidate.1 - previousTarget.1) < 0.34 {
            targetAnchorIndex = (targetAnchorIndex + 4) % anchors.count
        }
        let ordered = [anchors[targetAnchorIndex]] + anchors.enumerated().filter { $0.offset != targetAnchorIndex }.map(\.element)
        return index == targetIndex ? ordered[0] : ordered[(index + 1) % ordered.count]
    }

    private static func motion(for index: Int, round: Int, isTarget: Bool) -> (x: Double, y: Double, duration: Double, hue: Double) {
        let sign = (index + round + 1).isMultiple(of: 2) ? 1.0 : -1.0
        let seed = Double(((round + 3) * 31 + index * 23) % 17)
        if isTarget {
            return ((60 + seed * 3.2) * sign, 48 + seed * 2.1, 1.75 + Double(index) * 0.09, (seed * 37 + Double(index) * 47).truncatingRemainder(dividingBy: 360))
        }
        return ((26 + seed * 1.7) * sign, 24 + seed * 1.1, 2.65 + Double(index) * 0.15, (seed * 41 + Double(index) * 67).truncatingRemainder(dividingBy: 360))
    }
}
