import SwiftUI

struct LettersGameView: View {
    @EnvironmentObject private var app: AppViewModel
    @StateObject private var viewModel = LettersGameViewModel()

    var body: some View {
        VStack(spacing: 0) {
            GameTopBar(title: "Letters")
            ZStack(alignment: .top) {
                GeometryReader { proxy in
                    ForEach(Array(viewModel.tokens.enumerated()), id: \.element.id) { index, token in
                        FloatingChoiceButton(token: token, wrong: viewModel.wrongTokenID == token.id) {
                        viewModel.choose(token, app: app)
                    }
                        .position(position(for: index, in: proxy.size, itemSize: 132))
                        .zIndex(token.label == viewModel.target.symbol ? 1 : 0)
                    }
                }

                MascotPrompt(mascot: app.isCelebrating ? "🤩" : "😊", prompt: "Catch \(viewModel.target.symbol)!")
                    .padding(.top, 8)
                    .zIndex(3)
            }
        }
        .onAppear {
            viewModel.startRound()
            Task {
                await app.voiceQueue.playInstruction(parentClip: app.instructionClip, action: "Catch", target: viewModel.target.symbol)
            }
        }
    }

    private func position(for index: Int, in size: CGSize, itemSize: CGFloat) -> CGPoint {
        let layout: [(CGFloat, CGFloat)] = [
            (0.18, 0.18),
            (0.82, 0.20),
            (0.30, 0.50),
            (0.72, 0.58),
            (0.50, 0.84)
        ]
        let point = layout[index % layout.count]
        let radius = itemSize / 2
        let x = radius + 20 + point.0 * max(size.width - (radius * 2) - 40, 1)
        let safeTop = min(max(size.height * 0.30, 210), max(size.height - radius, radius))
        let safeBottom = max(safeTop + 1, size.height - radius - 24)
        let y = safeTop + point.1 * max(safeBottom - safeTop, 1)
        return CGPoint(x: x, y: y)
    }
}
