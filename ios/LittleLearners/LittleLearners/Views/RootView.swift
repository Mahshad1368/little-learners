import SwiftUI

struct RootView: View {
    @EnvironmentObject private var app: AppViewModel

    var body: some View {
        ZStack {
            ToyBackground()

            Group {
                switch app.screen {
                case .welcome:
                    WelcomeView()
                case .parentSetup:
                    ParentVoiceSetupView()
                case .home:
                    HomeView()
                case .letters:
                    LettersGameView()
                case .animals:
                    AnimalsGameView()
                case .miniGames:
                    MiniGamesView()
                }
            }
            .transition(.scale.combined(with: .opacity))

            ConfettiOverlay(isActive: app.isCelebrating, celebrationID: app.celebrationID)

            if app.showParentPanel {
                ParentSettingsPanel()
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                    .zIndex(5)
            }
        }
        .animation(.spring(response: 0.38, dampingFraction: 0.82), value: app.screen)
        .animation(.spring(response: 0.35, dampingFraction: 0.85), value: app.showParentPanel)
        .environment(\.layoutDirection, app.language.isRTL ? .rightToLeft : .leftToRight)
    }
}
