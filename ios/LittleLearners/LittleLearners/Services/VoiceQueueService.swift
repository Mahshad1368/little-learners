import AVFoundation
import Foundation

@MainActor
final class VoiceQueueService: NSObject, AVSpeechSynthesizerDelegate {
    private let audioPlayer = AudioPlayerService()
    private let synthesizer = AVSpeechSynthesizer()
    private var speechContinuation: CheckedContinuation<Void, Never>?
    private var voiceTask: Task<Void, Never>?

    var isMuted = false

    override init() {
        super.init()
        synthesizer.delegate = self
    }

    func clear() {
        voiceTask?.cancel()
        voiceTask = nil
        audioPlayer.stop()
        synthesizer.stopSpeaking(at: .immediate)
        speechContinuation?.resume()
        speechContinuation = nil
    }

    func playParentEncouragement(_ clip: VoiceClip?) async {
        guard !isMuted else { return }
        await enqueue {
            if let clip {
                await self.audioPlayer.play(url: clip.url, volume: 1.0)
            } else {
                await self.speak(MockLearningData.encouragementFallbacks.randomElement() ?? "Great job!", priority: .encouragement)
            }
        }
    }

    func playInstruction(action: String, target: String, language: AppLanguage) async {
        guard !isMuted else { return }
        await enqueue {
            await self.speak(action, priority: .instruction, language: language)
            await self.speak(target, priority: .target, language: language)
        }
    }

    private func enqueue(_ operation: @escaping @MainActor () async -> Void) async {
        clear()
        let task = Task { @MainActor in
            await operation()
        }
        voiceTask = task
        await task.value
        voiceTask = nil
    }

    private func speak(_ text: String, priority: VoicePriority, language: AppLanguage = .en) async {
        guard !text.isEmpty else { return }
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: language.speechCode) ?? AVSpeechSynthesisVoice(language: "en-US")
        utterance.rate = priority.rate
        utterance.pitchMultiplier = priority.pitch
        utterance.volume = 1.0

        await withCheckedContinuation { continuation in
            speechContinuation = continuation
            synthesizer.speak(utterance)
        }
    }

    nonisolated func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        Task { @MainActor in
            self.speechContinuation?.resume()
            self.speechContinuation = nil
        }
    }

    nonisolated func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) {
        Task { @MainActor in
            self.speechContinuation?.resume()
            self.speechContinuation = nil
        }
    }
}

private enum VoicePriority {
    case encouragement
    case instruction
    case target

    var rate: Float {
        switch self {
        case .encouragement: 0.45
        case .instruction: 0.42
        case .target: 0.36
        }
    }

    var pitch: Float {
        switch self {
        case .encouragement: 1.18
        case .instruction: 1.05
        case .target: 1.25
        }
    }
}
