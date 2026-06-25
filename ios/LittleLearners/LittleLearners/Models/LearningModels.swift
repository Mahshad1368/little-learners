import Foundation

enum AppScreen: Equatable {
    case welcome
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

enum AppLanguage: String, CaseIterable, Identifiable {
    case en
    case de
    case fa

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .en:
            return "English"
        case .de:
            return "Deutsch"
        case .fa:
            return "فارسی"
        }
    }

    var speechCode: String {
        switch self {
        case .en:
            return "en-US"
        case .de:
            return "de-DE"
        case .fa:
            return "fa-IR"
        }
    }

    var isRTL: Bool { self == .fa }
}

struct LocalizedCopy {
    let parentOnly: String
    let setupTitle: String
    let setupSubtitle: String
    let noticeBody: String
    let micLabel: String
    let startRecording: String
    let stopRecording: String
    let playPreview: String
    let recordAgain: String
    let continueButton: String
    let skipForNow: String
    let duration: String
    let language: String
    let catchWord: String
    let findWord: String
    let welcomeTagline: String
    let getStarted: String
}

extension AppLanguage {
    var copy: LocalizedCopy {
        switch self {
        case .en:
            return LocalizedCopy(
                parentOnly: "For Parents Only",
                setupTitle: "Parent Voice Setup",
                setupSubtitle: "Record your voice so your child can hear familiar encouragement during the game.",
                noticeBody: "Your recorded voice is saved only on this device and used inside the game to encourage your child.",
                micLabel: "One short, happy recording is enough.",
                startRecording: "Start Recording",
                stopRecording: "Stop Recording",
                playPreview: "Play Preview",
                recordAgain: "Record Again",
                continueButton: "Continue",
                skipForNow: "Skip for now",
                duration: "Duration",
                language: "Language",
                catchWord: "Catch",
                findWord: "Find",
                welcomeTagline: "Let's learn and play together!",
                getStarted: "Get Started"
            )
        case .de:
            return LocalizedCopy(
                parentOnly: "Nur für Eltern",
                setupTitle: "Stimme der Eltern einrichten",
                setupSubtitle: "Nehmen Sie Ihre Stimme auf, damit Ihr Kind während des Spiels vertraute Ermutigungen hört.",
                noticeBody: "Ihre Aufnahme bleibt nur auf diesem Gerät und wird im Spiel zur Ermutigung Ihres Kindes verwendet.",
                micLabel: "Eine kurze, fröhliche Aufnahme reicht.",
                startRecording: "Aufnahme starten",
                stopRecording: "Aufnahme stoppen",
                playPreview: "Vorschau anhören",
                recordAgain: "Erneut aufnehmen",
                continueButton: "Weiter",
                skipForNow: "Jetzt überspringen",
                duration: "Dauer",
                language: "Sprache",
                catchWord: "Fang",
                findWord: "Finde",
                welcomeTagline: "Lass uns gemeinsam lernen und spielen!",
                getStarted: "Los geht's"
            )
        case .fa:
            return LocalizedCopy(
                parentOnly: "فقط برای والدین",
                setupTitle: "تنظیم صدای والدین",
                setupSubtitle: "صدای خود را ضبط کنید تا کودک شما هنگام بازی صدایی آشنا و دلگرم‌کننده بشنود.",
                noticeBody: "صدای ضبط‌شده فقط روی همین دستگاه ذخیره می‌شود و برای تشویق کودک در بازی استفاده می‌شود.",
                micLabel: "یک ضبط کوتاه و شاد کافی است.",
                startRecording: "شروع ضبط",
                stopRecording: "توقف ضبط",
                playPreview: "پخش نمونه",
                recordAgain: "ضبط مجدد",
                continueButton: "ادامه",
                skipForNow: "فعلا رد کن",
                duration: "مدت زمان",
                language: "زبان",
                catchWord: "بگیر",
                findWord: "پیدا کن",
                welcomeTagline: "بیا با هم یاد بگیریم و بازی کنیم!",
                getStarted: "شروع کنیم"
            )
        }
    }
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
    var driftX: Double = 18
    var driftY: Double = 24
    var duration: Double = 2.6
    var isWrong = false
}

enum VoiceClipStorage {
    static let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
}
