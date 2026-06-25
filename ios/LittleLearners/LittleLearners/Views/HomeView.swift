import SwiftUI

struct HomeView: View {
    @EnvironmentObject private var app: AppViewModel

    var body: some View {
        ZStack {
            Image("WelcomeArt")
                .resizable()
                .scaledToFill()
                .opacity(0.26)
                .ignoresSafeArea()
            Rectangle()
                .fill(.white.opacity(0.42))
                .ignoresSafeArea()

            VStack(spacing: 18) {
                topBar
                Spacer(minLength: 8)
                Text("😊")
                    .font(.system(size: 112))
                    .frame(width: 170, height: 170)
                    .background(.white.opacity(0.58), in: Circle())
                    .overlay(Circle().stroke(.white.opacity(0.76), lineWidth: 1.5))
                    .shadow(color: ToyTheme.ink.opacity(0.14), radius: 22, x: 0, y: 12)

                LazyVGrid(columns: [GridItem(.adaptive(minimum: 210), spacing: 16)], spacing: 16) {
                    GiantToyButton(title: "Letters", emoji: "🔤", color: ToyTheme.berry) { app.setScreen(.letters) }
                    GiantToyButton(title: "Animals", emoji: "🦁", color: ToyTheme.sky) { app.setScreen(.animals) }
                    GiantToyButton(title: "Mini Games", emoji: "⭐", color: ToyTheme.leaf) { app.setScreen(.miniGames) }
                }
                Spacer(minLength: 8)
            }
            .padding(22)
        }
    }

    private var topBar: some View {
        HStack {
            ProgressStars(count: app.starCount)
            Spacer()
            ParentCornerButton()
        }
    }
}
