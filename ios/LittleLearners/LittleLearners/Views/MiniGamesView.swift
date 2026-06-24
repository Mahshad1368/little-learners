import SwiftUI

struct MiniGamesView: View {
    @EnvironmentObject private var app: AppViewModel
    @StateObject private var viewModel = MiniGamesViewModel()

    var body: some View {
        VStack(spacing: 14) {
            GameTopBar(title: "Mini Games")
            miniTabs
            Group {
                switch viewModel.activeGame {
                case .bubblePop:
                    BubblePopGame(app: app, viewModel: viewModel)
                case .feedMonster:
                    FeedMonsterGame(app: app, viewModel: viewModel)
                case .fishingLetters:
                    FishingLettersGame(app: app, viewModel: viewModel)
                case .catchStar:
                    CatchStarGame(app: app, viewModel: viewModel)
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(.white.opacity(0.30), in: RoundedRectangle(cornerRadius: 34, style: .continuous))
        }
        .padding(.horizontal, 18)
        .padding(.bottom, 18)
    }

    private var miniTabs: some View {
        HStack(spacing: 8) {
            ForEach(MockLearningData.miniGames) { game in
                Button {
                    viewModel.select(game.id)
                } label: {
                    Text(game.emoji)
                        .font(.system(size: 34))
                        .frame(maxWidth: .infinity, minHeight: 68)
                        .background(viewModel.activeGame == game.id ? ToyTheme.banana : .white.opacity(0.62), in: RoundedRectangle(cornerRadius: 22, style: .continuous))
                }
                .accessibilityLabel(game.title)
            }
        }
    }
}

private struct BubblePopGame: View {
    let app: AppViewModel
    @ObservedObject var viewModel: MiniGamesViewModel
    @State private var popped: Set<Int> = []

    var body: some View {
        GeometryReader { proxy in
            MascotPrompt(mascot: "🫧", prompt: "Pop!", compact: true)
                .frame(maxWidth: .infinity, alignment: .center)
                .padding(.top, 20)

            ForEach(0..<8, id: \.self) { index in
                Button {
                    popped.insert(index)
                    viewModel.reward(app: app)
                } label: {
                    Text("🫧")
                        .font(.system(size: popped.contains(index) ? 18 : 58))
                        .frame(width: 94, height: 94)
                        .background(.white.opacity(0.55), in: Circle())
                }
                .buttonStyle(.plain)
                .opacity(popped.contains(index) ? 0.18 : 1)
                .position(x: bubbleX(index, proxy.size.width), y: bubbleY(index, proxy.size.height))
                .accessibilityLabel("Pop bubble")
            }
        }
    }

    private func bubbleX(_ index: Int, _ width: CGFloat) -> CGFloat {
        CGFloat((index * 71) % Int(max(width - 120, 1))) + 60
    }

    private func bubbleY(_ index: Int, _ height: CGFloat) -> CGFloat {
        CGFloat((index * 97) % Int(max(height - 180, 1))) + 130
    }
}

private struct FeedMonsterGame: View {
    let app: AppViewModel
    @ObservedObject var viewModel: MiniGamesViewModel
    private let foods = ["🍓", "🍌", "🫐"]

    var body: some View {
        VStack(spacing: 28) {
            Spacer()
            Text(viewModel.fedCount.isMultiple(of: 2) ? "👾" : "😋")
                .font(.system(size: 128))
                .frame(width: 190, height: 190)
                .background(ToyTheme.lavender, in: RoundedRectangle(cornerRadius: 38, style: .continuous))
                .shadow(color: ToyTheme.ink.opacity(0.18), radius: 18, x: 0, y: 10)
            HStack(spacing: 12) {
                ForEach(foods, id: \.self) { food in
                    Button {
                        viewModel.fedCount += 1
                        viewModel.reward(app: app)
                    } label: {
                        Text(food)
                            .font(.system(size: 54))
                            .frame(maxWidth: .infinity, minHeight: 104)
                            .background(.white.opacity(0.68), in: RoundedRectangle(cornerRadius: 28, style: .continuous))
                    }
                    .accessibilityLabel("Feed the monster")
                }
            }
            Spacer()
        }
        .padding(20)
    }
}

private struct FishingLettersGame: View {
    let app: AppViewModel
    @ObservedObject var viewModel: MiniGamesViewModel

    var body: some View {
        GeometryReader { proxy in
            MascotPrompt(mascot: "🎣", prompt: "Catch \(viewModel.targetLetter.symbol)!", compact: true)
                .frame(maxWidth: .infinity, alignment: .center)
                .padding(.top, 20)

            ForEach(choices, id: \.self) { letter in
                Button {
                    letter == viewModel.targetLetter.symbol ? viewModel.reward(app: app) : viewModel.retry(letter: letter, app: app)
                } label: {
                    Text(letter)
                        .font(.system(size: 58, weight: .black, design: .rounded))
                        .foregroundStyle(letter == viewModel.targetLetter.symbol ? ToyTheme.berry : ToyTheme.sky)
                        .frame(width: 118, height: 92)
                        .background(viewModel.wrongLetter == letter ? Color.red.opacity(0.82) : .white.opacity(0.72), in: Capsule())
                }
                .buttonStyle(.plain)
                .position(x: fishX(letter, proxy.size.width), y: fishY(letter, proxy.size.height))
                .accessibilityLabel("Catch \(letter)")
            }
        }
    }

    private var choices: [String] {
        let letters = MockLearningData.letters.map(\.symbol)
        let index = viewModel.targetLetterIndex % letters.count
        return [
            letters[index],
            letters[(index + 2) % letters.count],
            letters[(index + 4) % letters.count]
        ]
    }

    private func fishX(_ letter: String, _ width: CGFloat) -> CGFloat {
        let value = abs(letter.hashValue)
        return CGFloat(value % Int(max(width - 140, 1))) + 70
    }

    private func fishY(_ letter: String, _ height: CGFloat) -> CGFloat {
        let value = abs(letter.hashValue / 11)
        return CGFloat(value % Int(max(height - 220, 1))) + 160
    }
}

private struct CatchStarGame: View {
    let app: AppViewModel
    @ObservedObject var viewModel: MiniGamesViewModel
    @State private var move = false

    var body: some View {
        GeometryReader { proxy in
            MascotPrompt(mascot: "🌟", prompt: "Catch the Star!", compact: true)
                .frame(maxWidth: .infinity, alignment: .center)
                .padding(.top, 20)

            Button {
                viewModel.reward(app: app)
            } label: {
                Text("⭐")
                    .font(.system(size: 92))
                    .frame(width: 146, height: 146)
                    .background(ToyTheme.banana, in: Circle())
                    .shadow(color: ToyTheme.banana.opacity(0.45), radius: 24, x: 0, y: 16)
            }
            .buttonStyle(.plain)
            .position(
                x: move ? max(proxy.size.width - 92, 92) : 92,
                y: move ? max(proxy.size.height - 120, 160) : 170
            )
            .animation(.easeInOut(duration: 2.4).repeatForever(autoreverses: true), value: move)
            .onAppear { move = true }
            .accessibilityLabel("Catch the Star")
        }
    }
}

struct GameTopBar: View {
    @EnvironmentObject private var app: AppViewModel
    let title: String

    var body: some View {
        HStack(spacing: 12) {
            Button {
                app.setScreen(.home)
            } label: {
                Image(systemName: "house.fill")
                    .font(.title3)
                    .foregroundStyle(ToyTheme.ink)
                    .frame(width: 52, height: 52)
                    .background(.white.opacity(0.68), in: Circle())
            }
            Spacer()
            ProgressStars(count: app.starCount, size: 26, font: .subheadline)
            ParentCornerButton()
        }
        .padding(.horizontal, 18)
        .padding(.top, 16)
    }
}
