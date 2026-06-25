import SwiftUI

struct HomeView: View {
    @EnvironmentObject private var app: AppViewModel

    var body: some View {
        GeometryReader { proxy in
            let isWide = proxy.size.width > 700
            let safeTop = max(proxy.safeAreaInsets.top, 12)
            let safeBottom = max(proxy.safeAreaInsets.bottom, 12)
            let foregroundHeight = max(proxy.size.height - safeTop - safeBottom, 1)
            let mascotSize: CGFloat = isWide ? 150 : min(max(foregroundHeight * 0.14, 92), 118)
            let cardHeight: CGFloat = isWide ? 164 : min(max((foregroundHeight - mascotSize - 128) / 3, 108), 132)

            ZStack {
                background(size: proxy.size)

                VStack(spacing: isWide ? 16 : 12) {
                    topBar
                    Spacer(minLength: isWide ? 20 : 8)
                    mascot(size: mascotSize)

                    if isWide {
                        LazyVGrid(columns: [GridItem(.adaptive(minimum: 210), spacing: 16)], spacing: 16) {
                            homeButtons(height: cardHeight)
                        }
                    } else {
                        VStack(spacing: 12) {
                            homeButtons(height: cardHeight)
                        }
                    }
                    Spacer(minLength: isWide ? 20 : 8)
                }
                .padding(.horizontal, isWide ? 44 : 22)
                .padding(.top, safeTop)
                .padding(.bottom, safeBottom)
                .frame(width: proxy.size.width, height: proxy.size.height)
            }
        }
    }

    private func background(size: CGSize) -> some View {
        ZStack {
            Image("WelcomeArt")
                .resizable()
                .scaledToFill()
                .frame(width: size.width, height: size.height)
                .clipped()
                .opacity(0.18)
            Rectangle()
                .fill(.white.opacity(0.56))
        }
        .ignoresSafeArea()
    }

    private func mascot(size: CGFloat) -> some View {
        Text("😊")
            .font(.system(size: size * 0.7))
            .frame(width: size, height: size)
            .background(.white.opacity(0.58), in: Circle())
            .overlay(Circle().stroke(.white.opacity(0.76), lineWidth: 1.5))
            .shadow(color: ToyTheme.ink.opacity(0.14), radius: 22, x: 0, y: 12)
    }

    @ViewBuilder
    private func homeButtons(height: CGFloat) -> some View {
        GiantToyButton(title: "Letters", emoji: "🔤", color: ToyTheme.berry, height: height) { app.setScreen(.letters) }
        GiantToyButton(title: "Animals", emoji: "🦁", color: ToyTheme.sky, height: height) { app.setScreen(.animals) }
        GiantToyButton(title: "Mini Games", emoji: "⭐", color: ToyTheme.leaf, height: height) { app.setScreen(.miniGames) }
    }

    private var topBar: some View {
        HStack {
            ProgressStars(count: app.starCount)
            Spacer()
            ParentCornerButton()
        }
    }
}
