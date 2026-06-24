import SwiftUI

struct ProgressStars: View {
    let count: Int
    var size: CGFloat = 34
    var font: Font = .title3

    var body: some View {
        HStack(spacing: max(3, size * 0.14)) {
            ForEach(0..<8, id: \.self) { index in
                Text("⭐")
                    .font(font)
                    .frame(width: size, height: size)
                    .background(index < min(count, 8) ? ToyTheme.banana : Color.white.opacity(0.65), in: Circle())
                    .opacity(index < min(count, 8) ? 1 : 0.52)
                    .scaleEffect(index < min(count, 8) ? 1.0 : 0.92)
            }
        }
        .padding(max(5, size * 0.18))
        .background(.white.opacity(0.56), in: Capsule())
        .accessibilityLabel("\(count) stars")
    }
}
