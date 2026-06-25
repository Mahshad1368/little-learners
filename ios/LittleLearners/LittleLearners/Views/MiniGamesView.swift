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
                    DragLettersGame(app: app, viewModel: viewModel)
                case .catchStar:
                    CatchFishGame(app: app, viewModel: viewModel)
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
    @State private var wrongBubble: Int?
    @State private var float = false

    var body: some View {
        GeometryReader { proxy in
            MascotPrompt(mascot: "🫧", prompt: app.language == .fa ? "روی حباب‌ها بزن!" : "Tap the bubbles!", compact: true)
                .frame(maxWidth: .infinity, alignment: .center)
                .padding(.top, 20)

            ForEach(0..<8, id: \.self) { index in
                if !popped.contains(index) {
                    Button {
                        pop(index)
                    } label: {
                        Text(index == 2 ? "☁️" : "🫧")
                            .font(.system(size: 58))
                            .frame(width: 104, height: 104)
                            .background(.white.opacity(0.58), in: Circle())
                            .shadow(color: ToyTheme.ink.opacity(0.12), radius: 14, x: 0, y: 8)
                    }
                    .buttonStyle(.plain)
                    .offset(
                        x: float ? CGFloat(8 + index * 2) : CGFloat(-8 - index),
                        y: float ? CGFloat(-18 + index) : CGFloat(12 - index)
                    )
                    .rotationEffect(.degrees(wrongBubble == index ? (float ? -7 : 7) : 0))
                    .animation(.easeInOut(duration: wrongBubble == index ? 0.18 : 2.8 + Double(index) * 0.16).repeatForever(autoreverses: true), value: float)
                    .position(x: bubbleX(index, proxy.size.width), y: bubbleY(index, proxy.size.height))
                    .accessibilityLabel("Pop bubble")
                } else {
                    Text("🌸✨")
                        .font(.system(size: 46))
                        .position(x: bubbleX(index, proxy.size.width), y: bubbleY(index, proxy.size.height))
                        .transition(.scale.combined(with: .opacity))
                }
            }
        }
        .onAppear { float = true }
    }

    private func pop(_ index: Int) {
        if index == 2 {
            wrongBubble = index
            app.wrongAnswer()
            Task {
                try? await Task.sleep(for: .milliseconds(520))
                wrongBubble = nil
            }
            return
        }

        popped.insert(index)
        viewModel.reward(app: app)
        if popped.count >= 6 {
            Task {
                try? await Task.sleep(for: .milliseconds(900))
                popped.removeAll()
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

private struct DragLettersGame: View {
    let app: AppViewModel
    @ObservedObject var viewModel: MiniGamesViewModel
    @State private var dragOffsets: [String: CGSize] = [:]

    var body: some View {
        GeometryReader { proxy in
            let dropZone = CGRect(x: proxy.size.width / 2 - 132, y: max(proxy.size.height - 176, 240), width: 264, height: 130)

            MascotPrompt(mascot: "🧺", prompt: dragPrompt, compact: true)
                .frame(maxWidth: .infinity, alignment: .center)
                .padding(.top, 20)

            VStack(spacing: 6) {
                Text(app.language == .fa ? "هدف" : "Target")
                    .font(.system(.caption, design: .rounded, weight: .black))
                    .foregroundStyle(ToyTheme.berry)
                Text(viewModel.targetLetter.symbol)
                    .font(.system(size: 46, weight: .black, design: .rounded))
                    .foregroundStyle(ToyTheme.berry)
                    .frame(width: 72, height: 72)
                    .background(ToyTheme.banana, in: Circle())
            }
            .position(x: proxy.size.width / 2, y: 132)

            RoundedRectangle(cornerRadius: 30, style: .continuous)
                .strokeBorder(style: StrokeStyle(lineWidth: 4, dash: [10, 8]))
                .foregroundStyle(ToyTheme.banana)
                .background(.white.opacity(0.58), in: RoundedRectangle(cornerRadius: 30, style: .continuous))
                .overlay {
                    VStack(spacing: 4) {
                        Text("🧺")
                            .font(.system(size: 44))
                        Text(app.language == .fa ? "اینجا بنداز" : "Drop here")
                            .font(.system(.headline, design: .rounded, weight: .black))
                    }
                }
                .frame(width: dropZone.width, height: dropZone.height)
                .position(x: dropZone.midX, y: dropZone.midY)

            ForEach(Array(choices.enumerated()), id: \.element) { index, letter in
                draggableLetter(letter, index: index, size: proxy.size, dropZone: dropZone)
            }
        }
    }

    private var dragPrompt: String {
        app.language == .fa ? "حرف \(viewModel.targetLetter.symbol) را بکش!" : "Drag \(viewModel.targetLetter.symbol)!"
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

    private func draggableLetter(_ letter: String, index: Int, size: CGSize, dropZone: CGRect) -> some View {
        let origin = letterPosition(index, size)
        let offset = dragOffsets[letter, default: .zero]

        return Text(letter)
            .font(.system(size: 58, weight: .black, design: .rounded))
            .foregroundStyle(letter == viewModel.targetLetter.symbol ? ToyTheme.berry : ToyTheme.ink)
            .frame(width: 118, height: 104)
            .background(viewModel.wrongLetter == letter ? Color.red.opacity(0.82) : letter == viewModel.targetLetter.symbol ? ToyTheme.banana : .white.opacity(0.72), in: RoundedRectangle(cornerRadius: 32, style: .continuous))
            .shadow(color: ToyTheme.ink.opacity(0.16), radius: 14, x: 0, y: 8)
            .position(x: origin.x + offset.width, y: origin.y + offset.height)
            .gesture(
                DragGesture()
                    .onChanged { value in
                        dragOffsets[letter] = value.translation
                    }
                    .onEnded { value in
                        let finalPoint = CGPoint(x: origin.x + value.translation.width, y: origin.y + value.translation.height)
                        if dropZone.contains(finalPoint) {
                            if letter == viewModel.targetLetter.symbol {
                                viewModel.reward(app: app)
                            } else {
                                viewModel.retry(letter: letter, app: app)
                            }
                        }
                        withAnimation(.spring(response: 0.38, dampingFraction: 0.62)) {
                            dragOffsets[letter] = .zero
                        }
                    }
            )
            .accessibilityLabel("Drag \(letter)")
    }

    private func letterPosition(_ index: Int, _ size: CGSize) -> CGPoint {
        let layout: [(CGFloat, CGFloat)] = [(0.18, 0.34), (0.78, 0.38), (0.28, 0.58), (0.70, 0.62), (0.50, 0.48)]
        let point = layout[index % layout.count]
        return CGPoint(x: 70 + point.0 * max(size.width - 140, 1), y: 180 + point.1 * max(size.height - 380, 1))
    }
}

private struct CatchFishGame: View {
    let app: AppViewModel
    @ObservedObject var viewModel: MiniGamesViewModel
    @State private var move = false
    @State private var caught = false
    @State private var swimRound = 0

    var body: some View {
        GeometryReader { proxy in
            MascotPrompt(mascot: "🐟", prompt: app.language == .fa ? "ماهی را بگیر!" : "Catch the Fish!", compact: true)
                .frame(maxWidth: .infinity, alignment: .center)
                .padding(.top, 20)

            if caught {
                Text("💦✨")
                    .font(.system(size: 72))
                    .frame(width: 150, height: 150)
                    .background(ToyTheme.sky.opacity(0.28), in: Circle())
                    .position(x: proxy.size.width / 2, y: proxy.size.height / 2)
                    .transition(.scale.combined(with: .opacity))
            } else {
                Button {
                    catchFish()
                } label: {
                    ZStack {
                        Circle()
                            .fill(.white.opacity(0.56))
                            .frame(width: 154, height: 154)
                        CuteRedFish()
                        Text("🫧")
                            .font(.title)
                            .offset(x: 58, y: -32)
                    }
                    .shadow(color: ToyTheme.ink.opacity(0.15), radius: 18, x: 0, y: 10)
                }
                .buttonStyle(.plain)
                .position(fishPosition(proxy.size))
                .rotationEffect(.degrees(move ? 8 : -8))
                .animation(.easeInOut(duration: 2.8).repeatForever(autoreverses: true), value: move)
                .accessibilityLabel("Catch the fish")
            }
        }
        .onAppear { move = true }
    }

    private func catchFish() {
        caught = true
        viewModel.reward(app: app)
        Task {
            try? await Task.sleep(for: .milliseconds(900))
            swimRound += 1
            caught = false
            move.toggle()
        }
    }

    private func fishPosition(_ size: CGSize) -> CGPoint {
        let positions: [(CGFloat, CGFloat)] = [(0.22, 0.42), (0.76, 0.58), (0.54, 0.32), (0.30, 0.72)]
        let point = positions[swimRound % positions.count]
        let waveX: CGFloat = move ? 46 : -36
        let waveY: CGFloat = move ? -34 : 38
        return CGPoint(x: 90 + point.0 * max(size.width - 180, 1) + waveX, y: 170 + point.1 * max(size.height - 300, 1) + waveY)
    }
}

private struct CuteRedFish: View {
    var body: some View {
        ZStack {
            Capsule()
                .fill(LinearGradient(colors: [.red, .orange, ToyTheme.banana], startPoint: .leading, endPoint: .trailing))
                .frame(width: 92, height: 56)
            Triangle()
                .fill(.red)
                .frame(width: 36, height: 42)
                .rotationEffect(.degrees(-90))
                .offset(x: -56)
            Circle()
                .fill(ToyTheme.ink)
                .frame(width: 8, height: 8)
                .offset(x: 30, y: -10)
            Capsule()
                .fill(.white.opacity(0.75))
                .frame(width: 18, height: 6)
                .offset(x: 40, y: 8)
        }
        .frame(width: 132, height: 90)
    }
}

private struct Triangle: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
        path.closeSubpath()
        return path
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
