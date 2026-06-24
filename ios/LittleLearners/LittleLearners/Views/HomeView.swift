import SwiftUI

struct HomeView: View {
    @EnvironmentObject private var app: AppViewModel

    var body: some View {
        VStack(spacing: 18) {
            topBar
            Spacer(minLength: 8)
            Text("😊")
                .font(.system(size: 112))
                .frame(width: 170, height: 170)
                .background(.white.opacity(0.72), in: Circle())
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

    private var topBar: some View {
        HStack {
            ProgressStars(count: app.starCount)
            Spacer()
            ParentCornerButton()
        }
    }
}
