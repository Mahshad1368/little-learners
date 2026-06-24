import AVFoundation
import Foundation

@MainActor
final class AudioPlayerService: NSObject, AVAudioPlayerDelegate {
    private var player: AVAudioPlayer?
    private var continuation: CheckedContinuation<Void, Never>?

    func play(url: URL, volume: Float = 1.0) async {
        guard FileManager.default.fileExists(atPath: url.path) else { return }

        player?.stop()
        continuation?.resume()
        continuation = nil

        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, mode: .default, options: [.mixWithOthers])
            try session.setActive(true)

            let player = try AVAudioPlayer(contentsOf: url)
            player.volume = volume
            player.delegate = self
            player.prepareToPlay()
            self.player = player

            await withCheckedContinuation { continuation in
                self.continuation = continuation
                player.play()
            }
        } catch {
            continuation?.resume()
            continuation = nil
        }
    }

    func stop() {
        player?.stop()
        player = nil
        continuation?.resume()
        continuation = nil
    }

    nonisolated func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        Task { @MainActor in
            self.player = nil
            self.continuation?.resume()
            self.continuation = nil
        }
    }

    nonisolated func audioPlayerDecodeErrorDidOccur(_ player: AVAudioPlayer, error: Error?) {
        Task { @MainActor in
            self.player = nil
            self.continuation?.resume()
            self.continuation = nil
        }
    }
}
