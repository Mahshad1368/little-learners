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
        let targetIndex = symbols.firstIndex(where: { $0.symbol == target.symbol }) ?? 0
        tokens = symbols.enumerated().map { index, item in
            let isTarget = item.symbol == target.symbol
            let anchor = Self.anchor(for: index, targetIndex: targetIndex, round: round, kindOffset: 1)
            let motion = Self.motion(for: index, round: round, isTarget: isTarget)
            return FloatingToken(
                label: item.symbol,
                emoji: nil,
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
                await app.voiceQueue.playInstruction(action: app.language.copy.catchWord, target: self.target.symbol, language: app.language)
            }
        }
    }

    private func rotatedLetters() -> [LetterItem] {
        let letters = MockLearningData.letters
        let start = round % letters.count
        return Array(letters[start...]) + Array(letters[..<start])
    }

    private static func anchor(for index: Int, targetIndex: Int, round: Int, kindOffset: Int) -> (x: Double, y: Double) {
        let anchors: [(Double, Double)] = [
            (0.16, 0.22),
            (0.80, 0.20),
            (0.28, 0.50),
            (0.74, 0.56),
            (0.44, 0.78),
            (0.82, 0.82),
            (0.18, 0.74)
        ]
        var targetAnchorIndex = (round * 5 + targetIndex * 2 + kindOffset) % anchors.count
        let previousTarget = anchors[((round - 1) * 5 + targetIndex * 2 + kindOffset + anchors.count) % anchors.count]
        let candidate = anchors[targetAnchorIndex]
        if abs(candidate.0 - previousTarget.0) + abs(candidate.1 - previousTarget.1) < 0.34 {
            targetAnchorIndex = (targetAnchorIndex + 3) % anchors.count
        }
        let ordered = [anchors[targetAnchorIndex]] + anchors.enumerated().filter { $0.offset != targetAnchorIndex }.map(\.element)
        return index == targetIndex ? ordered[0] : ordered[(index + 1) % ordered.count]
    }

    private static func motion(for index: Int, round: Int, isTarget: Bool) -> (x: Double, y: Double, duration: Double, hue: Double) {
        let sign = (index + round).isMultiple(of: 2) ? 1.0 : -1.0
        let seed = Double(((round + 2) * 29 + index * 17) % 19)
        if isTarget {
            return ((54 + seed * 3) * sign, 44 + seed * 1.9, 1.85 + Double(index) * 0.08, (seed * 31 + Double(index) * 53).truncatingRemainder(dividingBy: 360))
        }
        return ((24 + seed * 1.8) * sign, 22 + seed, 2.75 + Double(index) * 0.14, (seed * 43 + Double(index) * 59).truncatingRemainder(dividingBy: 360))
    }
}
