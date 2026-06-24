import SwiftUI

struct ParentVoiceSetupView: View {
    @EnvironmentObject private var app: AppViewModel
    @StateObject private var viewModel = ParentVoiceSetupViewModel()

    var body: some View {
        ScrollView {
            VStack(spacing: 22) {
                header
                heroCard
                recordingGrid
                bottomActions
            }
            .padding(.horizontal, 22)
            .padding(.vertical, 24)
            .frame(maxWidth: 920)
            .frame(maxWidth: .infinity)
        }
    }

    private var header: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text("Little Learners")
                    .font(.system(.title2, design: .rounded, weight: .black))
                    .foregroundStyle(ToyTheme.ink)
                Text("For parents only")
                    .font(.system(.caption, design: .rounded, weight: .black))
                    .foregroundStyle(ToyTheme.berry)
                    .textCase(.uppercase)
            }
            Spacer()
            Text("👪")
                .font(.system(size: 42))
                .frame(width: 64, height: 64)
                .background(.white.opacity(0.75), in: RoundedRectangle(cornerRadius: 22, style: .continuous))
        }
    }

    private var heroCard: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Parent Voice Setup")
                .font(.system(size: 42, weight: .black, design: .rounded))
                .foregroundStyle(ToyTheme.ink)
                .minimumScaleFactor(0.72)
            Text("Record your voice before your child starts playing, so they hear familiar encouragement during the game.")
                .font(.system(.title3, design: .rounded, weight: .bold))
                .foregroundStyle(ToyTheme.ink.opacity(0.72))
                .fixedSize(horizontal: false, vertical: true)

            HStack(alignment: .top, spacing: 12) {
                Text("🔒")
                    .font(.title)
                VStack(alignment: .leading, spacing: 4) {
                    Text("For Parents Only")
                        .font(.system(.title3, design: .rounded, weight: .black))
                    Text("Your recorded voice is saved only on this device and used inside the game to encourage your child.")
                        .font(.system(.body, design: .rounded, weight: .semibold))
                        .foregroundStyle(ToyTheme.ink.opacity(0.68))
                }
            }
            .padding(18)
            .background(ToyTheme.banana.opacity(0.28), in: RoundedRectangle(cornerRadius: 24, style: .continuous))
        }
        .padding(24)
        .background(.white.opacity(0.82), in: RoundedRectangle(cornerRadius: 34, style: .continuous))
        .shadow(color: ToyTheme.ink.opacity(0.12), radius: 24, x: 0, y: 16)
    }

    private var recordingGrid: some View {
        LazyVGrid(columns: [GridItem(.adaptive(minimum: 280), spacing: 16)], spacing: 16) {
            VoiceSlotCard(
                title: "Encouragement voice",
                prompt: "Try: Yay! Great job!",
                kind: .encouragement,
                viewModel: viewModel,
                preview: playPreview
            )
            VoiceSlotCard(
                title: "Instruction voice",
                prompt: "Try: Catch or Find",
                kind: .instruction,
                viewModel: viewModel,
                preview: playPreview
            )
        }
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
                Text("Continue")
                    .font(.system(.title3, design: .rounded, weight: .black))
                    .frame(maxWidth: .infinity, minHeight: 62)
                    .background(canContinue ? ToyTheme.leaf : Color.gray.opacity(0.28), in: RoundedRectangle(cornerRadius: 24, style: .continuous))
                    .foregroundStyle(canContinue ? ToyTheme.ink : ToyTheme.ink.opacity(0.38))
            }
            .disabled(!canContinue)

            Button("Skip for now") {
                app.skipSetup()
            }
            .font(.system(.headline, design: .rounded, weight: .black))
            .foregroundStyle(ToyTheme.ink.opacity(0.62))
            .frame(maxWidth: .infinity, minHeight: 52)
        }
    }

    private var canContinue: Bool {
        viewModel.hasClip(.encouragement) && viewModel.hasClip(.instruction)
    }

    private func playPreview(_ clip: VoiceClip) {
        Task {
            let previewPlayer = AudioPlayerService()
            await previewPlayer.play(url: clip.url)
        }
    }
}

private struct VoiceSlotCard: View {
    let title: String
    let prompt: String
    let kind: VoiceClipKind
    @ObservedObject var viewModel: ParentVoiceSetupViewModel
    let preview: (VoiceClip) -> Void

    var body: some View {
        VStack(spacing: 16) {
            Text("🎙️")
                .font(.system(size: 64))
                .frame(width: 110, height: 110)
                .background(ToyTheme.berry.opacity(0.14), in: RoundedRectangle(cornerRadius: 32, style: .continuous))

            VStack(spacing: 6) {
                Text(title)
                    .font(.system(.title3, design: .rounded, weight: .black))
                    .foregroundStyle(ToyTheme.ink)
                Text(prompt)
                    .font(.system(.callout, design: .rounded, weight: .bold))
                    .foregroundStyle(ToyTheme.ink.opacity(0.62))
            }

            Text(format(viewModel.activeKind == kind ? viewModel.duration : 0))
                .font(.system(.title3, design: .rounded, weight: .black))
                .foregroundStyle(ToyTheme.ink)
                .padding(.horizontal, 16)
                .padding(.vertical, 9)
                .background(.white.opacity(0.8), in: Capsule())

            if viewModel.activeKind == kind && viewModel.isRecording {
                Button("Stop Recording") {
                    viewModel.stop()
                }
                .primaryToyButton(color: .red)
            } else {
                Button(viewModel.hasClip(kind) ? "Record Again" : "Start Recording") {
                    viewModel.hasClip(kind) ? viewModel.recordAgain(kind: kind) : viewModel.start(kind: kind)
                }
                .primaryToyButton(color: ToyTheme.berry)
            }

            Button("Play Preview") {
                if let clip = viewModel.clip(for: kind) {
                    preview(clip)
                }
            }
            .primaryToyButton(color: ToyTheme.banana, foreground: ToyTheme.ink)
            .disabled(!viewModel.hasClip(kind))
            .opacity(viewModel.hasClip(kind) ? 1 : 0.45)
        }
        .padding(22)
        .background(.white.opacity(0.86), in: RoundedRectangle(cornerRadius: 32, style: .continuous))
        .shadow(color: ToyTheme.ink.opacity(0.12), radius: 18, x: 0, y: 12)
    }

    private func format(_ duration: TimeInterval) -> String {
        let seconds = max(0, Int(duration.rounded()))
        return "\(seconds / 60):\(String(format: "%02d", seconds % 60))"
    }
}
