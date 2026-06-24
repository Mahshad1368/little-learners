import SwiftUI

struct AnimalsGameView: View {
    @EnvironmentObject private var app: AppViewModel
    @StateObject private var viewModel = AnimalsGameViewModel()

    var body: some View {
        VStack(spacing: 0) {
            GameTopBar(title: "Animals")
            ZStack(alignment: .top) {
                GeometryReader { proxy in
                    ForEach(Array(viewModel.tokens.enumerated()), id: \.element.id) { index, token in
                        FloatingChoiceButton(token: token, wrong: viewModel.wrongTokenID == token.id) {
                            viewModel.choose(token, app: app)
                        }
                        .position(position(for: index, in: proxy.size, itemSize: 146))
                        .zIndex(token.label == viewModel.target.name ? 1 : 0)
                    }
                }

                MascotPrompt(mascot: app.isCelebrating ? "🌟" : "🐯", prompt: "\(app.language.copy.findWord) \(viewModel.target.name)!")
                    .padding(.top, 8)
                    .zIndex(3)
            }
        }
        .onAppear {
            viewModel.startRound()
            Task {
                await app.voiceQueue.playInstruction(action: app.language.copy.findWord, target: viewModel.target.name, language: app.language)
            }
        }
    }

    private func position(for index: Int, in size: CGSize, itemSize: CGFloat) -> CGPoint {
        let layout: [(CGFloat, CGFloat)] = [
            (0.20, 0.24),
            (0.78, 0.28),
            (0.30, 0.66),
            (0.72, 0.72)
        ]
        let point = layout[index % layout.count]
        let radius = itemSize / 2
        let x = radius + 20 + point.0 * max(size.width - (radius * 2) - 40, 1)
        let safeTop = min(max(size.height * 0.30, 220), max(size.height - radius, radius))
        let safeBottom = max(safeTop + 1, size.height - radius - 24)
        let y = safeTop + point.1 * max(safeBottom - safeTop, 1)
        return CGPoint(x: x, y: y)
    }
}
