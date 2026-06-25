import SwiftUI

struct AnimalsGameView: View {
    @EnvironmentObject private var app: AppViewModel
    @StateObject private var viewModel = AnimalsGameViewModel()

    var body: some View {
        VStack(spacing: 0) {
            GameTopBar(title: app.language.copy.animalsTitle)
            ZStack(alignment: .top) {
                GeometryReader { proxy in
                    ForEach(Array(viewModel.tokens.enumerated()), id: \.element.id) { index, token in
                        FloatingChoiceButton(token: token, wrong: viewModel.wrongTokenID == token.id) {
                            let currentTarget = viewModel.target(for: app.language)
                            if token.label == currentTarget.name {
                                app.soundEffects.playAnimalSound(currentTarget.soundPrompt)
                            }
                            viewModel.choose(token, app: app)
                        }
                        .position(position(for: token, in: proxy.size, itemSize: 146))
                        .zIndex(token.label == viewModel.target(for: app.language).name ? 1 : 0)
                    }
                }

                MascotPrompt(mascot: app.isCelebrating ? "🌟" : "🐯", prompt: app.language.findPrompt(for: viewModel.target(for: app.language).name))
                    .padding(.top, 8)
                    .zIndex(3)
            }
        }
        .onAppear {
            viewModel.startRound(language: app.language)
            Task {
                let currentTarget = viewModel.target(for: app.language)
                await app.voiceQueue.playAnimalInstruction(action: app.language.copy.findWord, animal: currentTarget, language: app.language)
                app.soundEffects.playAnimalSound(currentTarget.soundPrompt)
            }
        }
        .onChange(of: app.language) { _, language in
            viewModel.startRound(language: language)
            Task {
                let currentTarget = viewModel.target(for: language)
                await app.voiceQueue.playAnimalInstruction(action: language.copy.findWord, animal: currentTarget, language: language)
                app.soundEffects.playAnimalSound(currentTarget.soundPrompt)
            }
        }
    }

    private func position(for token: FloatingToken, in size: CGSize, itemSize: CGFloat) -> CGPoint {
        let radius = itemSize / 2
        let x = radius + 20 + token.x * max(size.width - (radius * 2) - 40, 1)
        let safeTop = min(max(size.height * 0.30, 220), max(size.height - radius, radius))
        let safeBottom = max(safeTop + 1, size.height - radius - 24)
        let y = safeTop + token.y * max(safeBottom - safeTop, 1)
        return CGPoint(x: x, y: y)
    }
}
