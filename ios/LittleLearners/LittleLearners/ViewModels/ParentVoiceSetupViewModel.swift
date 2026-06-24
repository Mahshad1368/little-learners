import Foundation

@MainActor
final class ParentVoiceSetupViewModel: ObservableObject {
    @Published var clips: [VoiceClip] = []
    @Published var activeKind: VoiceClipKind?
    @Published var errorMessage: String?
    @Published var isRecording = false
    @Published var duration: TimeInterval = 0

    let recorder = AudioRecorderService()
    private var durationTimer: Timer?

    func hasClip(_ kind: VoiceClipKind) -> Bool {
        clips.contains { $0.kind == kind }
    }

    func clip(for kind: VoiceClipKind) -> VoiceClip? {
        clips.first { $0.kind == kind }
    }

    func start(kind: VoiceClipKind) {
        Task {
            do {
                activeKind = kind
                _ = try await recorder.startRecording(kind: kind)
                isRecording = true
                startDurationTimer()
                errorMessage = nil
            } catch {
                activeKind = nil
                isRecording = false
                stopDurationTimer()
                errorMessage = error.localizedDescription
            }
        }
    }

    func stop() {
        guard let activeKind else { return }
        let _ = recorder.stopRecording()
        isRecording = false
        duration = recorder.duration
        stopDurationTimer()
        let fileName = "\(activeKind.rawValue)-voice.m4a"
        let clip = VoiceClip(id: UUID(), kind: activeKind, fileName: fileName, createdAt: Date())
        clips.removeAll { $0.kind == activeKind }
        clips.append(clip)
        self.activeKind = nil
    }

    func recordAgain(kind: VoiceClipKind) {
        clips.removeAll { $0.kind == kind }
        start(kind: kind)
    }

    private func startDurationTimer() {
        durationTimer?.invalidate()
        durationTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            Task { @MainActor in
                guard let self else { return }
                self.duration = self.recorder.duration
            }
        }
    }

    private func stopDurationTimer() {
        durationTimer?.invalidate()
        durationTimer = nil
    }
}
