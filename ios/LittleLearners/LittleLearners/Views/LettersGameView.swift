import SwiftUI

struct LettersGameView: View {
    @EnvironmentObject private var app: AppViewModel
    @StateObject private var viewModel = LettersGameViewModel()

    var body: some View {
        VStack(spacing: 0) {
            GameTopBar(title: app.language.copy.lettersTitle)
            ZStack(alignment: .top) {
                GeometryReader { proxy in
                    ForEach(Array(viewModel.tokens.enumerated()), id: \.element.id) { index, token in
                        FloatingChoiceButton(token: token, wrong: viewModel.wrongTokenID == token.id) {
                            viewModel.choose(token, app: app)
                        }
                        .position(position(for: token, in: proxy.size, itemSize: 132))
                        .zIndex(token.label == viewModel.target(for: app.language).symbol ? 1 : 0)
                    }
                }

                MascotPrompt(mascot: app.isCelebrating ? "🤩" : "😊", prompt: app.language.catchPrompt(for: viewModel.target(for: app.language).symbol))
                    .padding(.top, 8)
                    .zIndex(3)
            }
        }
        .onAppear {
            viewModel.startRound(language: app.language)
            Task {
                await app.voiceQueue.playInstruction(action: app.language.copy.catchWord, target: viewModel.target(for: app.language).symbol, language: app.language)
            }
        }
        .onChange(of: app.language) { _, language in
            viewModel.startRound(language: language)
            Task {
                await app.voiceQueue.playInstruction(action: language.copy.catchWord, target: viewModel.target(for: language).symbol, language: language)
            }
        }
    }

    private func position(for token: FloatingToken, in size: CGSize, itemSize: CGFloat) -> CGPoint {
        let radius = itemSize / 2
        let x = radius + 20 + token.x * max(size.width - (radius * 2) - 40, 1)
        let safeTop = min(max(size.height * 0.30, 210), max(size.height - radius, radius))
        let safeBottom = max(safeTop + 1, size.height - radius - 24)
        let y = safeTop + token.y * max(safeBottom - safeTop, 1)
        return CGPoint(x: x, y: y)
    }
}
