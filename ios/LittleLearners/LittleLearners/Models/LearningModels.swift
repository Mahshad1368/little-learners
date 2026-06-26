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
    let appName: String
    let welcomeTitle: String
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
    let lettersTitle: String
    let animalsTitle: String
    let miniGamesTitle: String
    let parentSettings: String
    let parentSettingsAccessibility: String
    let stars: String
    let soundOn: String
    let mute: String
    let resetVoiceRecordings: String
    let resetStars: String
    let close: String
    let target: String
    let dropHere: String
    let tapBubbles: String
    let popBubbleAccessibility: String
    let catchFish: String
    let catchFishAccessibility: String
    let bubblePopTitle: String
    let dragLettersTitle: String
    let catchFishTitle: String
}

extension AppLanguage {
    var copy: LocalizedCopy {
        switch self {
        case .en:
            return LocalizedCopy(
                appName: "KiddoLearny",
                welcomeTitle: "hey Baby",
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
                getStarted: "Get Started",
                lettersTitle: "Letters",
                animalsTitle: "Animals",
                miniGamesTitle: "Mini Games",
                parentSettings: "Parent Settings",
                parentSettingsAccessibility: "Parent settings",
                stars: "stars",
                soundOn: "Sound On",
                mute: "Mute",
                resetVoiceRecordings: "Reset Voice Recordings",
                resetStars: "Reset Stars",
                close: "Close",
                target: "Target",
                dropHere: "Drop here",
                tapBubbles: "Tap the bubbles!",
                popBubbleAccessibility: "Pop bubble",
                catchFish: "Catch the Fish!",
                catchFishAccessibility: "Catch the fish",
                bubblePopTitle: "Bubble Pop",
                dragLettersTitle: "Drag Letters",
                catchFishTitle: "Catch the Fish"
            )
        case .de:
            return LocalizedCopy(
                appName: "KiddoLearny",
                welcomeTitle: "Hallo Baby",
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
                getStarted: "Los geht's",
                lettersTitle: "Buchstaben",
                animalsTitle: "Tiere",
                miniGamesTitle: "Minispiele",
                parentSettings: "Elternbereich",
                parentSettingsAccessibility: "Elternbereich",
                stars: "Sterne",
                soundOn: "Ton an",
                mute: "Stumm",
                resetVoiceRecordings: "Stimmen löschen",
                resetStars: "Sterne zurücksetzen",
                close: "Schließen",
                target: "Ziel",
                dropHere: "Hier ablegen",
                tapBubbles: "Tippe die Blasen!",
                popBubbleAccessibility: "Blase platzen lassen",
                catchFish: "Fang den Fisch!",
                catchFishAccessibility: "Fang den Fisch",
                bubblePopTitle: "Blasen",
                dragLettersTitle: "Buchstaben ziehen",
                catchFishTitle: "Fisch fangen"
            )
        case .fa:
            return LocalizedCopy(
                appName: "KiddoLearny",
                welcomeTitle: "سلام کوچولو",
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
                getStarted: "شروع کنیم",
                lettersTitle: "حروف",
                animalsTitle: "حیوانات",
                miniGamesTitle: "بازی‌ها",
                parentSettings: "تنظیمات والدین",
                parentSettingsAccessibility: "تنظیمات والدین",
                stars: "ستاره",
                soundOn: "صدا روشن",
                mute: "بی‌صدا",
                resetVoiceRecordings: "حذف صدای ضبط‌شده",
                resetStars: "حذف ستاره‌ها",
                close: "بستن",
                target: "هدف",
                dropHere: "اینجا بنداز",
                tapBubbles: "روی حباب‌ها بزن!",
                popBubbleAccessibility: "ترکاندن حباب",
                catchFish: "ماهی را بگیر!",
                catchFishAccessibility: "گرفتن ماهی",
                bubblePopTitle: "حباب‌ها",
                dragLettersTitle: "کشیدن حروف",
                catchFishTitle: "گرفتن ماهی"
            )
        }
    }

    var alphabetSymbols: [String] {
        switch self {
        case .en:
            return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".map(String.init)
        case .de:
            return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".map(String.init) + ["Ä", "Ö", "Ü", "ß"]
        case .fa:
            return ["آ", "ا", "ب", "پ", "ت", "ث", "ج", "چ", "ح", "خ", "د", "ذ", "ر", "ز", "ژ", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ک", "گ", "ل", "م", "ن", "و", "ه", "ی"]
        }
    }

    var letters: [LetterItem] {
        alphabetSymbols.map { LetterItem(symbol: $0) }
    }

    var animals: [AnimalItem] {
        switch self {
        case .en:
            return [
                AnimalItem(name: "Lion", emoji: "🦁", soundPrompt: "Roar"),
                AnimalItem(name: "Dog", emoji: "🐶", soundPrompt: "Woof"),
                AnimalItem(name: "Cat", emoji: "🐱", soundPrompt: "Meow"),
                AnimalItem(name: "Cow", emoji: "🐮", soundPrompt: "Moooo"),
                AnimalItem(name: "Bird", emoji: "🐦", soundPrompt: "Tweet")
            ]
        case .de:
            return [
                AnimalItem(name: "Löwe", emoji: "🦁", soundPrompt: "Roar"),
                AnimalItem(name: "Hund", emoji: "🐶", soundPrompt: "Woof"),
                AnimalItem(name: "Katze", emoji: "🐱", soundPrompt: "Meow"),
                AnimalItem(name: "Kuh", emoji: "🐮", soundPrompt: "Moooo"),
                AnimalItem(name: "Vogel", emoji: "🐦", soundPrompt: "Tweet")
            ]
        case .fa:
            return [
                AnimalItem(name: "شیر", emoji: "🦁", soundPrompt: "Roar"),
                AnimalItem(name: "سگ", emoji: "🐶", soundPrompt: "Woof"),
                AnimalItem(name: "گربه", emoji: "🐱", soundPrompt: "Meow"),
                AnimalItem(name: "گاو", emoji: "🐮", soundPrompt: "Moooo"),
                AnimalItem(name: "پرنده", emoji: "🐦", soundPrompt: "Tweet")
            ]
        }
    }

    var miniGames: [MiniGameItem] {
        [
            MiniGameItem(id: .bubblePop, title: copy.bubblePopTitle, emoji: "🫧"),
            MiniGameItem(id: .fishingLetters, title: copy.dragLettersTitle, emoji: "🔤"),
            MiniGameItem(id: .catchStar, title: copy.catchFishTitle, emoji: "🐠")
        ]
    }

    func catchPrompt(for target: String) -> String {
        switch self {
        case .en:
            return "\(copy.catchWord) \(target)!"
        case .de:
            return "\(copy.catchWord) \(target)!"
        case .fa:
            return "\(target) را \(copy.catchWord)!"
        }
    }

    func findPrompt(for target: String) -> String {
        switch self {
        case .en:
            return "\(copy.findWord) \(target)!"
        case .de:
            return "\(copy.findWord) \(target)!"
        case .fa:
            return "\(target) را \(copy.findWord)!"
        }
    }

    func dragPrompt(for target: String) -> String {
        switch self {
        case .en:
            return "Drag \(target)!"
        case .de:
            return "Zieh \(target)!"
        case .fa:
            return "حرف \(target) را بکش!"
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
    var colorHue: Double = 45
    var isWrong = false
}

enum VoiceClipStorage {
    static let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
}
