import AudioToolbox
import Foundation

@MainActor
final class SoundEffectsService {
    var isMuted = false

    func playPop() {
        play(1104)
    }

    func playClap() {
        play(1113)
    }

    func playCheer() {
        play(1025)
    }

    func playSoftBuzzer() {
        play(1053)
    }

    private func play(_ id: SystemSoundID) {
        guard !isMuted else { return }
        AudioServicesPlaySystemSound(id)
    }
}
