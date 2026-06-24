import SwiftUI

struct ProgressStars: View {
    let count: Int

    var body: some View {
        HStack(spacing: 6) {
            ForEach(0..<8, id: \.self) { index in
                Text("⭐")
                    .font(.title3)
                    .frame(width: 34, height: 34)
                    .background(index < min(count, 8) ? ToyTheme.banana : Color.white.opacity(0.65), in: Circle())
                    .opacity(index < min(count, 8) ? 1 : 0.52)
                    .scaleEffect(index < min(count, 8) ? 1.0 : 0.92)
            }
        }
        .padding(8)
        .background(.white.opacity(0.56), in: Capsule())
        .accessibilityLabel("\(count) stars")
    }
}
