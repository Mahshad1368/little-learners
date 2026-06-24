import SwiftUI

struct AnimalsGameView: View {
    @EnvironmentObject private var app: AppViewModel
    @StateObject private var viewModel = AnimalsGameViewModel()

    var body: some View {
        ZStack {
            VStack {
                GameTopBar(title: "Animals")
                Spacer()
            }
            MascotPrompt(mascot: app.isCelebrating ? "🌟" : "🐯", prompt: "Find \(viewModel.target.name)!")
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
                await app.voiceQueue.playInstruction(parentClip: app.instructionClip, action: "Find", target: viewModel.target.name)
            }
        }
    }

    private func clamp(_ token: FloatingToken, proxy: GeometryProxy) -> FloatingToken {
        var adjusted = token
        adjusted.x = min(max(token.x, 84), max(proxy.size.width - 84, 84))
        adjusted.y = min(max(token.y, 190), max(proxy.size.height - 96, 190))
        return adjusted
    }
}
