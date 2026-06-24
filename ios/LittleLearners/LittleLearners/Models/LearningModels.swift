import Foundation

enum AppScreen: Equatable {
    case parentSetup
    case home
    case letters
    case animals
    case miniGames
}

enum VoiceClipKind: String, Codable, CaseIterable, Identifiable {
    case encouragement
    case instruction

    var id: String { rawValue }
}

struct VoiceClip: Codable, Equatable, Identifiable {
    let id: UUID
    let kind: VoiceClipKind
    let fileName: String
    let createdAt: Date

    var url: URL {
        VoiceClipStorage.documentsDirectory.appendingPathComponent(fileName)
    }
}

struct LetterItem: Identifiable, Equatable {
    let id = UUID()
    let symbol: String
}

struct AnimalItem: Identifiable, Equatable {
    let id = UUID()
    let name: String
    let emoji: String
    let soundPrompt: String
}

enum MiniGameKind: String, CaseIterable, Identifiable {
    case bubblePop
    case feedMonster
    case fishingLetters
    case catchStar

    var id: String { rawValue }
}

struct MiniGameItem: Identifiable, Equatable {
    let id: MiniGameKind
    let title: String
    let emoji: String
}

struct FloatingToken: Identifiable {
    let id = UUID()
    let label: String
    let emoji: String?
    var x: Double
    var y: Double
    var scale: Double
    var isWrong = false
}

enum VoiceClipStorage {
    static let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
}
