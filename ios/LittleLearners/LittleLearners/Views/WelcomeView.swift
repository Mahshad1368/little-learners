import SwiftUI

struct WelcomeView: View {
    @EnvironmentObject private var app: AppViewModel

    var body: some View {
        GeometryReader { proxy in
            ZStack {
                Image("WelcomeArt")
                    .resizable()
                    .scaledToFit()
                    .frame(width: proxy.size.width, height: proxy.size.height)
                    .clipped()
                    .ignoresSafeArea()
                LinearGradient(colors: [.clear, .white.opacity(0.28), .white.opacity(0.94)], startPoint: .top, endPoint: .bottom)
                    .ignoresSafeArea()

                VStack(spacing: 18) {
                    header
                    Spacer()
                    headline
                    startButton
                }
                .padding(22)
            }
        }
        .environment(\.layoutDirection, app.language.isRTL ? .rightToLeft : .leftToRight)
    }

    private var header: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(app.language.copy.appName)
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
                Text(app.language.rawValue)
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

    private var headline: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(app.language.copy.welcomeTitle)
                .font(.system(size: 52, weight: .black, design: .rounded))
                .foregroundStyle(ToyTheme.berry)
                .minimumScaleFactor(0.72)
            Text(app.language.copy.welcomeTagline)
                .font(.system(.title3, design: .rounded, weight: .bold))
                .foregroundStyle(ToyTheme.ink.opacity(0.72))
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(20)
        .background(.white.opacity(0.62), in: RoundedRectangle(cornerRadius: 28, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: 28, style: .continuous).stroke(.white.opacity(0.76), lineWidth: 1))
        .shadow(color: ToyTheme.ink.opacity(0.14), radius: 20, x: 0, y: 12)
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
