import SwiftUI

struct LettersGameView: View {
    @EnvironmentObject private var app: AppViewModel
    @StateObject private var viewModel = LettersGameViewModel()

    var body: some View {
        ZStack {
            VStack {
                GameTopBar(title: "Letters")
                Spacer()
            }
            MascotPrompt(mascot: app.isCelebrating ? "🤩" : "😊", prompt: "Catch \(viewModel.target.symbol)!")
                .frame(maxHeight: .infinity, alignment: .top)
                .padding(.top, 86)

            GeometryReader { proxy in
                ForEach(viewModel.tokens) { token in
                    FloatingChoiceButton(token: clamp(token, proxy: proxy), wrong: viewModel.wrongTokenID == token.id) {
                        viewModel.choose(token, app: app)
                    }
                }
            }
            .padding(.top, 110)
        }
        .onAppear {
            viewModel.startRound()
            Task {
                await app.voiceQueue.playInstruction(parentClip: app.instructionClip, action: "Catch", target: viewModel.target.symbol)
            }
        }
    }

    private func clamp(_ token: FloatingToken, proxy: GeometryProxy) -> FloatingToken {
        var adjusted = token
        adjusted.x = min(max(token.x, 78), max(proxy.size.width - 78, 78))
        adjusted.y = min(max(token.y, 180), max(proxy.size.height - 90, 180))
        return adjusted
    }
}
