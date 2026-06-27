import SwiftUI

struct ParentVoiceSetupView: View {
    @EnvironmentObject private var app: AppViewModel
    @StateObject private var viewModel = ParentVoiceSetupViewModel()

    var body: some View {
        ScrollView {
            VStack(spacing: 14) {
                header
                heroCard
                VoiceSlotCard(viewModel: viewModel, preview: playPreview)
                bottomActions
            }
            .padding(.horizontal, 22)
            .padding(.vertical, 16)
            .frame(maxWidth: 920)
            .frame(maxWidth: .infinity)
        }
        .environment(\.layoutDirection, app.language.isRTL ? .rightToLeft : .leftToRight)
    }

    private var header: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(app.language.copy.appName)
                    .font(.system(.title2, design: .rounded, weight: .black))
                    .foregroundStyle(ToyTheme.ink)
                Text(app.language.copy.parentOnly)
                    .font(.system(.caption, design: .rounded, weight: .black))
                    .foregroundStyle(ToyTheme.berry)
                    .textCase(.uppercase)
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

    private var heroCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(app.language.copy.setupTitle)
                .font(.system(size: 42, weight: .black, design: .rounded))
                .foregroundStyle(ToyTheme.ink)
                .minimumScaleFactor(0.72)
            Text(app.language.copy.setupSubtitle)
                .font(.system(.title3, design: .rounded, weight: .bold))
                .foregroundStyle(ToyTheme.ink.opacity(0.72))
                .fixedSize(horizontal: false, vertical: true)

            HStack(alignment: .top, spacing: 12) {
                Text("🔒")
                    .font(.title)
                VStack(alignment: .leading, spacing: 4) {
                    Text(app.language.copy.parentOnly)
                        .font(.system(.title3, design: .rounded, weight: .black))
                    Text(app.language.copy.noticeBody)
                        .font(.system(.body, design: .rounded, weight: .semibold))
                        .foregroundStyle(ToyTheme.ink.opacity(0.68))
                }
            }
            .padding(14)
            .background(ToyTheme.banana.opacity(0.28), in: RoundedRectangle(cornerRadius: 24, style: .continuous))
        }
        .padding(20)
        .background(.white.opacity(0.82), in: RoundedRectangle(cornerRadius: 34, style: .continuous))
        .shadow(color: ToyTheme.ink.opacity(0.12), radius: 24, x: 0, y: 16)
    }

    private var bottomActions: some View {
        VStack(spacing: 12) {
            if let error = viewModel.errorMessage {
                Text(error)
                    .font(.system(.callout, design: .rounded, weight: .bold))
                    .foregroundStyle(.red)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(.white.opacity(0.76), in: RoundedRectangle(cornerRadius: 18, style: .continuous))
            }

            Button {
                app.completeSetup(with: viewModel.clips)
            } label: {
                Text(app.language.copy.continueButton)
                    .font(.system(.title3, design: .rounded, weight: .black))
                    .frame(maxWidth: .infinity, minHeight: 62)
                    .background(canContinue ? ToyTheme.leaf : Color.gray.opacity(0.28), in: RoundedRectangle(cornerRadius: 24, style: .continuous))
                    .foregroundStyle(canContinue ? ToyTheme.ink : ToyTheme.ink.opacity(0.38))
            }
            .disabled(!canContinue)

            Button(app.language.copy.skipForNow) {
                app.skipSetup()
            }
            .font(.system(.headline, design: .rounded, weight: .black))
            .foregroundStyle(ToyTheme.ink.opacity(0.62))
            .frame(maxWidth: .infinity, minHeight: 52)
        }
    }

    private var canContinue: Bool {
        viewModel.hasClip(.encouragement)
    }

    private func playPreview(_ clip: VoiceClip) {
        Task {
            let previewPlayer = AudioPlayerService()
            await previewPlayer.play(url: clip.url)
        }
    }
}

private struct VoiceSlotCard: View {
    @EnvironmentObject private var app: AppViewModel
    @ObservedObject var viewModel: ParentVoiceSetupViewModel
    let preview: (VoiceClip) -> Void
    private let kind: VoiceClipKind = .encouragement

    var body: some View {
        VStack(spacing: 10) {
            Text("🎙️")
                .font(.system(size: 48))
                .frame(width: 78, height: 78)
                .background(ToyTheme.berry.opacity(0.14), in: RoundedRectangle(cornerRadius: 24, style: .continuous))

            VStack(spacing: 6) {
                Text(app.language.copy.micLabel)
                    .font(.system(.title3, design: .rounded, weight: .black))
                    .foregroundStyle(ToyTheme.ink)
            }

            Text(format(viewModel.activeKind == kind ? viewModel.duration : 0))
                .font(.system(.title3, design: .rounded, weight: .black))
                .foregroundStyle(ToyTheme.ink)
                .padding(.horizontal, 16)
                .padding(.vertical, 9)
                .background(.white.opacity(0.8), in: Capsule())

            if viewModel.activeKind == kind && viewModel.isRecording {
                Button(app.language.copy.stopRecording) {
                    viewModel.stop()
                }
                .primaryToyButton(color: .red)
            } else if viewModel.hasClip(kind) {
                HStack(spacing: 10) {
                    Button(app.language.copy.recordAgain) {
                        viewModel.recordAgain(kind: kind)
                    }
                    .primaryToyButton(color: ToyTheme.berry)

                    Button(app.language.copy.playPreview) {
                        if let clip = viewModel.clip(for: kind) {
                            preview(clip)
                        }
                    }
                    .primaryToyButton(color: ToyTheme.banana, foreground: ToyTheme.ink)
                }
            } else {
                Button(viewModel.hasClip(kind) ? app.language.copy.recordAgain : app.language.copy.startRecording) {
                    viewModel.hasClip(kind) ? viewModel.recordAgain(kind: kind) : viewModel.start(kind: kind)
                }
                .primaryToyButton(color: ToyTheme.berry)
            }
        }
        .padding(16)
        .background(.white.opacity(0.86), in: RoundedRectangle(cornerRadius: 32, style: .continuous))
        .shadow(color: ToyTheme.ink.opacity(0.12), radius: 18, x: 0, y: 12)
        .environment(\.layoutDirection, app.language.isRTL ? .rightToLeft : .leftToRight)
    }

    private func format(_ duration: TimeInterval) -> String {
        let seconds = max(0, Int(duration.rounded()))
        return "\(seconds / 60):\(String(format: "%02d", seconds % 60))"
    }
}
