import Foundation
import SwiftUI

@MainActor
final class AppViewModel: ObservableObject {
    @Published var screen: AppScreen
    @Published var starCount: Int
    @Published var isMuted: Bool {
        didSet {
            UserDefaults.standard.set(isMuted, forKey: PersistenceKeys.muted)
            soundEffects.isMuted = isMuted
            voiceQueue.isMuted = isMuted
        }
    }
    @Published var voiceClips: [VoiceClip] {
        didSet {
            saveVoiceClips()
        }
    }
    @Published var language: AppLanguage {
        didSet {
            defaults.set(language.rawValue, forKey: PersistenceKeys.language)
        }
    }
    @Published var showParentPanel = false
    @Published var celebrationID = UUID()
    @Published var isCelebrating = false

    let voiceQueue = VoiceQueueService()
    let soundEffects = SoundEffectsService()

    private let defaults = UserDefaults.standard

    init() {
        let complete = defaults.bool(forKey: PersistenceKeys.setupComplete)
        screen = complete ? .home : .parentSetup
        starCount = defaults.integer(forKey: PersistenceKeys.starCount)
        isMuted = defaults.bool(forKey: PersistenceKeys.muted)
        voiceClips = Self.loadVoiceClips()
        language = AppLanguage(rawValue: defaults.string(forKey: PersistenceKeys.language) ?? "") ?? .en
        soundEffects.isMuted = isMuted
        voiceQueue.isMuted = isMuted
    }

    var encouragementClip: VoiceClip? {
        voiceClips.first { $0.kind == .encouragement }
    }

    func completeSetup(with clips: [VoiceClip]) {
        voiceClips = clips.filter { $0.kind == .encouragement }
        defaults.set(true, forKey: PersistenceKeys.setupComplete)
        screen = .home
    }

    func skipSetup() {
        voiceClips = []
        defaults.set(true, forKey: PersistenceKeys.setupComplete)
        screen = .home
    }

    func resetVoiceRecordings() {
        for clip in voiceClips {
            try? FileManager.default.removeItem(at: clip.url)
        }
        voiceClips = []
        defaults.set(false, forKey: PersistenceKeys.setupComplete)
        screen = .parentSetup
        showParentPanel = false
    }

    func setScreen(_ nextScreen: AppScreen) {
        voiceQueue.clear()
        showParentPanel = false
        screen = nextScreen
    }

    func resetProgress() {
        starCount = 0
        defaults.set(starCount, forKey: PersistenceKeys.starCount)
    }

    func reward(afterParentVoice operation: @escaping () async -> Void) async {
        guard !isCelebrating else { return }
        isCelebrating = true
        celebrationID = UUID()
        starCount += 1
        defaults.set(starCount, forKey: PersistenceKeys.starCount)

        soundEffects.playPop()
        soundEffects.playClap()
        soundEffects.playCheer()

        await voiceQueue.playParentEncouragement(encouragementClip)
        try? await Task.sleep(for: .milliseconds(500))
        await operation()
        isCelebrating = false
    }

    func wrongAnswer() {
        soundEffects.playSoftBuzzer()
    }

    private func saveVoiceClips() {
        guard let data = try? JSONEncoder().encode(voiceClips) else { return }
        defaults.set(data, forKey: PersistenceKeys.voiceClips)
    }

    private static func loadVoiceClips() -> [VoiceClip] {
        guard let data = UserDefaults.standard.data(forKey: PersistenceKeys.voiceClips),
              let clips = try? JSONDecoder().decode([VoiceClip].self, from: data) else {
            return []
        }
        return clips.filter { $0.kind == .encouragement && FileManager.default.fileExists(atPath: $0.url.path) }
    }
}
