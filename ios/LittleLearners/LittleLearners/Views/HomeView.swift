import SwiftUI

struct HomeView: View {
    @EnvironmentObject private var app: AppViewModel

    var body: some View {
        GeometryReader { proxy in
            ZStack {
                Image("WelcomeArt")
                    .resizable()
                    .scaledToFill()
                    .frame(width: proxy.size.width, height: proxy.size.height)
                    .clipped()
                    .opacity(0.18)
                    .ignoresSafeArea()
                Rectangle()
                    .fill(.white.opacity(0.56))
                    .ignoresSafeArea()

                VStack(spacing: 14) {
                    topBar
                    Spacer(minLength: 4)
                    Text("😊")
                        .font(.system(size: proxy.size.width > 700 ? 104 : 82))
                        .frame(width: proxy.size.width > 700 ? 150 : 118, height: proxy.size.width > 700 ? 150 : 118)
                        .background(.white.opacity(0.58), in: Circle())
                        .overlay(Circle().stroke(.white.opacity(0.76), lineWidth: 1.5))
                        .shadow(color: ToyTheme.ink.opacity(0.14), radius: 22, x: 0, y: 12)

                    if proxy.size.width > 700 {
                        LazyVGrid(columns: [GridItem(.adaptive(minimum: 210), spacing: 16)], spacing: 16) {
                            homeButtons
                        }
                    } else {
                        VStack(spacing: 12) {
                            homeButtons
                        }
                    }
                    Spacer(minLength: 4)
                }
                .padding(22)
                .frame(width: proxy.size.width, height: proxy.size.height)
            }
        }
    }

    @ViewBuilder
    private var homeButtons: some View {
        GiantToyButton(title: "Letters", emoji: "🔤", color: ToyTheme.berry) { app.setScreen(.letters) }
        GiantToyButton(title: "Animals", emoji: "🦁", color: ToyTheme.sky) { app.setScreen(.animals) }
        GiantToyButton(title: "Mini Games", emoji: "⭐", color: ToyTheme.leaf) { app.setScreen(.miniGames) }
    }

    private var topBar: some View {
        HStack {
            ProgressStars(count: app.starCount)
            Spacer()
            ParentCornerButton()
        }
    }
}
