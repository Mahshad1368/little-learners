import SwiftUI

struct WelcomeView: View {
    @EnvironmentObject private var app: AppViewModel

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                header

                HStack(alignment: .center, spacing: 20) {
                    heroArt
                    headline
                }
                .padding(22)
                .background(.white.opacity(0.82), in: RoundedRectangle(cornerRadius: 34, style: .continuous))
                .shadow(color: ToyTheme.ink.opacity(0.12), radius: 24, x: 0, y: 16)

                startButton
            }
            .padding(.horizontal, 22)
            .padding(.vertical, 24)
            .frame(maxWidth: 920)
            .frame(maxWidth: .infinity)
        }
        .environment(\.layoutDirection, app.language.isRTL ? .rightToLeft : .leftToRight)
    }

    private var header: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text("Little Learners")
                    .font(.system(.title2, design: .rounded, weight: .black))
                    .foregroundStyle(ToyTheme.ink)
            }
            Spacer()
            languageSelector
        }
    }

    private var languageSelector: some View {
        Menu {
            ForEach(AppLanguage.allCases) { language in
                Button(language.displayName) {
                    app.language = language
                }
            }
        } label: {
            HStack(spacing: 8) {
                Image(systemName: "globe")
                Text(app.language.displayName)
                    .lineLimit(1)
            }
            .font(.system(.headline, design: .rounded, weight: .black))
            .foregroundStyle(ToyTheme.ink)
            .padding(.horizontal, 14)
            .frame(minHeight: 52)
            .background(.white.opacity(0.78), in: RoundedRectangle(cornerRadius: 20, style: .continuous))
        }
        .accessibilityLabel(app.language.copy.language)
    }

    private var heroArt: some View {
        Image("WelcomeArt")
            .resizable()
            .interpolation(.high)
            .scaledToFit()
            .frame(maxWidth: 420)
            .clipShape(RoundedRectangle(cornerRadius: 28, style: .continuous))
    }

    private var headline: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("hey Baby")
                .font(.system(size: 52, weight: .black, design: .rounded))
                .foregroundStyle(ToyTheme.berry)
                .minimumScaleFactor(0.72)
            Text(app.language.copy.welcomeTagline)
                .font(.system(.title3, design: .rounded, weight: .bold))
                .foregroundStyle(ToyTheme.ink.opacity(0.72))
                .fixedSize(horizontal: false, vertical: true)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var startButton: some View {
        Button {
            app.setScreen(.parentSetup)
        } label: {
            Text(app.language.copy.getStarted)
                .font(.system(.title3, design: .rounded, weight: .black))
                .frame(maxWidth: .infinity, minHeight: 62)
                .background(ToyTheme.leaf.gradient, in: RoundedRectangle(cornerRadius: 24, style: .continuous))
                .foregroundStyle(ToyTheme.ink)
        }
        .shadow(color: ToyTheme.leaf.opacity(0.30), radius: 12, x: 0, y: 8)
    }
}

#Preview {
    WelcomeView()
        .environmentObject(AppViewModel())
}
