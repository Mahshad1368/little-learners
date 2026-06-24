import SwiftUI

enum ToyTheme {
    static let ink = Color(red: 0.14, green: 0.19, blue: 0.31)
    static let berry = Color(red: 1.00, green: 0.36, blue: 0.54)
    static let banana = Color(red: 1.00, green: 0.82, blue: 0.40)
    static let mint = Color(red: 0.36, green: 0.92, blue: 0.83)
    static let sky = Color(red: 0.38, green: 0.65, blue: 0.98)
    static let leaf = Color(red: 0.35, green: 0.86, blue: 0.57)
    static let lavender = Color(red: 0.76, green: 0.70, blue: 0.99)

    static let background = LinearGradient(
        colors: [
            Color(red: 1.00, green: 0.96, blue: 0.88),
            Color(red: 0.88, green: 0.99, blue: 1.00),
            Color(red: 0.92, green: 1.00, blue: 0.94)
        ],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
}
