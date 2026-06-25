import SwiftUI

struct ParentSettingsPanel: View {
    @EnvironmentObject private var app: AppViewModel

    var body: some View {
        VStack(spacing: 12) {
            Capsule()
                .fill(ToyTheme.ink.opacity(0.18))
                .frame(width: 44, height: 5)
            Text("Parent Settings")
                .font(.system(.title3, design: .rounded, weight: .black))
                .foregroundStyle(ToyTheme.ink)
            Text("\(app.starCount) stars")
                .font(.system(.callout, design: .rounded, weight: .bold))
                .foregroundStyle(ToyTheme.ink.opacity(0.62))

            languagePicker
                .padding(.vertical, 4)

            Button(app.isMuted ? "Sound On" : "Mute") {
                app.isMuted.toggle()
            }
            .primaryToyButton(color: ToyTheme.banana, foreground: ToyTheme.ink)

            Button("Reset Voice Recordings") {
                app.resetVoiceRecordings()
            }
            .primaryToyButton(color: ToyTheme.berry)

            Button("Reset Stars") {
                app.resetProgress()
            }
            .primaryToyButton(color: ToyTheme.ink)

            Button("Close") {
                app.showParentPanel = false
            }
            .font(.system(.headline, design: .rounded, weight: .black))
            .foregroundStyle(ToyTheme.ink)
            .padding(.top, 4)
        }
        .padding(22)
        .frame(maxWidth: 360)
        .background(.white.opacity(0.96), in: RoundedRectangle(cornerRadius: 28, style: .continuous))
        .shadow(color: ToyTheme.ink.opacity(0.22), radius: 26, x: 0, y: 16)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottom)
        .padding(20)
        .environment(\.layoutDirection, app.language.isRTL ? .rightToLeft : .leftToRight)
    }

    private var languagePicker: some View {
        VStack(alignment: app.language.isRTL ? .trailing : .leading, spacing: 8) {
            Text(app.language.copy.language)
                .font(.system(.caption, design: .rounded, weight: .black))
                .foregroundStyle(ToyTheme.berry)

            HStack(spacing: 8) {
                ForEach(AppLanguage.allCases) { language in
                    Button {
                        app.language = language
                    } label: {
                        Text(language.rawValue)
                            .font(.system(.callout, design: .rounded, weight: .black))
                            .foregroundStyle(app.language == language ? ToyTheme.ink : ToyTheme.ink.opacity(0.70))
                            .frame(maxWidth: .infinity, minHeight: 46)
                            .background(app.language == language ? ToyTheme.banana : .white.opacity(0.68), in: Capsule())
                    }
                    .accessibilityLabel(language.displayName)
                }
            }
        }
    }
}

struct ParentCornerButton: View {
    @EnvironmentObject private var app: AppViewModel

    var body: some View {
        Button {
            app.showParentPanel.toggle()
        } label: {
            Image(systemName: "gearshape.fill")
                .font(.title3)
                .foregroundStyle(ToyTheme.ink)
                .frame(width: 48, height: 48)
                .background(.white.opacity(0.65), in: Circle())
        }
        .accessibilityLabel("Parent settings")
    }
}
