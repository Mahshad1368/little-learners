import AVFoundation
import Foundation

@MainActor
final class AudioRecorderService: NSObject, ObservableObject {
    @Published private(set) var isRecording = false
    @Published private(set) var duration: TimeInterval = 0
    @Published private(set) var permissionDenied = false

    private var recorder: AVAudioRecorder?
    private var timer: Timer?
    private let session = AVAudioSession.sharedInstance()

    func requestPermission() async -> Bool {
        await withCheckedContinuation { continuation in
            AVAudioApplication.requestRecordPermission { allowed in
                continuation.resume(returning: allowed)
            }
        }
    }

    func startRecording(kind: VoiceClipKind) async throws -> URL {
        let allowed = await requestPermission()
        guard allowed else {
            permissionDenied = true
            throw AudioRecorderError.permissionDenied
        }

        try session.setCategory(.playAndRecord, mode: .default, options: [.defaultToSpeaker, .allowBluetoothHFP])
        try session.setActive(true)

        let url = VoiceClipStorage.documentsDirectory.appendingPathComponent("\(kind.rawValue)-voice.m4a")
        let settings: [String: Any] = [
            AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
            AVSampleRateKey: 44_100,
            AVNumberOfChannelsKey: 1,
            AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
        ]

        let recorder = try AVAudioRecorder(url: url, settings: settings)
        recorder.isMeteringEnabled = true
        recorder.prepareToRecord()
        recorder.record()

        self.recorder = recorder
        isRecording = true
        duration = 0
        startTimer()
        return url
    }

    func stopRecording() -> TimeInterval {
        guard let recorder else { return duration }
        recorder.stop()
        let finalDuration = recorder.currentTime
        self.recorder = nil
        isRecording = false
        duration = finalDuration
        stopTimer()
        try? session.setActive(false, options: .notifyOthersOnDeactivation)
        return finalDuration
    }

    func cancelRecording() {
        recorder?.stop()
        recorder?.deleteRecording()
        recorder = nil
        isRecording = false
        duration = 0
        stopTimer()
        try? session.setActive(false, options: .notifyOthersOnDeactivation)
    }

    private func startTimer() {
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            Task { @MainActor in
                guard let self, let recorder = self.recorder else { return }
                recorder.updateMeters()
                self.duration = recorder.currentTime
            }
        }
    }

    private func stopTimer() {
        timer?.invalidate()
        timer = nil
    }
}

enum AudioRecorderError: LocalizedError {
    case permissionDenied

    var errorDescription: String? {
        "Microphone permission is needed to record a parent voice."
    }
}
