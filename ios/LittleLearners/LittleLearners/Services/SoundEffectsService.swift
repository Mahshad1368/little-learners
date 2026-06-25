import AudioToolbox
import AVFoundation
import Foundation

@MainActor
final class SoundEffectsService {
    var isMuted = false
    private var animalEngines: [AVAudioEngine] = []

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

    func playAnimalSound(_ sound: String) {
        guard !isMuted else { return }

        let key = sound.lowercased()
        if key.contains("moo") {
            playSynth(segments: [
                SynthSegment(start: 0.00, duration: 0.62, from: 165, to: 86, wave: .saw, volume: 0.28),
                SynthSegment(start: 0.05, duration: 0.66, from: 118, to: 72, wave: .sine, volume: 0.22)
            ])
        } else if key.contains("roar") {
            playSynth(segments: [
                SynthSegment(start: 0.00, duration: 0.48, from: 128, to: 58, wave: .saw, volume: 0.30),
                SynthSegment(start: 0.00, duration: 0.42, from: 0, to: 0, wave: .noise, volume: 0.20)
            ])
        } else if key.contains("woof") {
            playSynth(segments: [
                SynthSegment(start: 0.00, duration: 0.16, from: 230, to: 116, wave: .square, volume: 0.28),
                SynthSegment(start: 0.20, duration: 0.16, from: 210, to: 104, wave: .square, volume: 0.24)
            ])
        } else if key.contains("meow") {
            playSynth(segments: [
                SynthSegment(start: 0.00, duration: 0.24, from: 520, to: 880, wave: .sine, volume: 0.24),
                SynthSegment(start: 0.18, duration: 0.30, from: 880, to: 420, wave: .sine, volume: 0.20)
            ])
        } else if key.contains("quack") {
            playSynth(segments: [
                SynthSegment(start: 0.00, duration: 0.13, from: 360, to: 278, wave: .saw, volume: 0.24),
                SynthSegment(start: 0.17, duration: 0.13, from: 390, to: 300, wave: .saw, volume: 0.22)
            ])
        } else {
            playSynth(segments: [
                SynthSegment(start: 0.00, duration: 0.09, from: 980, to: 1320, wave: .square, volume: 0.14),
                SynthSegment(start: 0.11, duration: 0.09, from: 1120, to: 1480, wave: .square, volume: 0.14)
            ])
        }
    }

    private func play(_ id: SystemSoundID) {
        guard !isMuted else { return }
        AudioServicesPlaySystemSound(id)
    }

    private func playSynth(segments: [SynthSegment]) {
        let sampleRate = 44_100.0
        let totalDuration = (segments.map { $0.start + $0.duration }.max() ?? 0.3) + 0.04
        guard let format = AVAudioFormat(standardFormatWithSampleRate: sampleRate, channels: 1),
              let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: AVAudioFrameCount(totalDuration * sampleRate)) else {
            return
        }

        buffer.frameLength = buffer.frameCapacity
        guard let channel = buffer.floatChannelData?[0] else { return }

        for frame in 0..<Int(buffer.frameLength) {
            channel[frame] = 0
        }

        for segment in segments {
            let startFrame = max(0, Int(segment.start * sampleRate))
            let endFrame = min(Int(buffer.frameLength), startFrame + Int(segment.duration * sampleRate))
            guard endFrame > startFrame else { continue }

            for frame in startFrame..<endFrame {
                let progress = Double(frame - startFrame) / max(Double(endFrame - startFrame), 1)
                let envelope = Float(sin(progress * .pi))
                let frequency = segment.from > 0 ? segment.from * pow(max(segment.to, 1) / segment.from, progress) : 0
                let value: Float

                switch segment.wave {
                case .sine:
                    value = Float(sin((Double(frame) / sampleRate) * frequency * 2 * .pi))
                case .saw:
                    value = Float(2 * ((Double(frame) * frequency / sampleRate).truncatingRemainder(dividingBy: 1)) - 1)
                case .square:
                    value = sin((Double(frame) / sampleRate) * frequency * 2 * .pi) >= 0 ? 1 : -1
                case .noise:
                    value = Float.random(in: -1...1)
                }

                channel[frame] += value * envelope * segment.volume
            }
        }

        let engine = AVAudioEngine()
        let player = AVAudioPlayerNode()
        engine.attach(player)
        engine.connect(player, to: engine.mainMixerNode, format: format)
        animalEngines.append(engine)

        player.scheduleBuffer(buffer, at: nil, options: []) { [weak self, weak engine] in
            Task { @MainActor in
                engine?.stop()
                if let engine {
                    self?.animalEngines.removeAll { $0 === engine }
                }
            }
        }

        do {
            try engine.start()
            player.play()
        } catch {
            animalEngines.removeAll { $0 === engine }
        }
    }
}

private enum SynthWave {
    case sine
    case saw
    case square
    case noise
}

private struct SynthSegment {
    let start: Double
    let duration: Double
    let from: Double
    let to: Double
    let wave: SynthWave
    let volume: Float
}
