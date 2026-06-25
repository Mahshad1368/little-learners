import SwiftUI

struct GiantToyButton: View {
    let title: String
    let emoji: String
    let color: Color
    let height: CGFloat
    let action: () -> Void

    init(title: String, emoji: String, color: Color, height: CGFloat = 132, action: @escaping () -> Void) {
        self.title = title
        self.emoji = emoji
        self.color = color
        self.height = height
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            VStack(spacing: 10) {
                Text(emoji)
                    .font(.system(size: 54))
                Text(title)
                    .font(.system(.title3, design: .rounded, weight: .black))
                    .multilineTextAlignment(.center)
                    .minimumScaleFactor(0.72)
            }
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity, minHeight: height, maxHeight: height)
            .padding(.horizontal, 16)
            .background {
                RoundedRectangle(cornerRadius: 48, style: .continuous)
                    .fill(
                        LinearGradient(
                            colors: [color.opacity(0.92), color.opacity(0.72), .white.opacity(0.34)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .overlay(alignment: .topLeading) {
                        RoundedRectangle(cornerRadius: 48, style: .continuous)
                            .fill(.white.opacity(0.34))
                            .frame(height: 62)
                            .blur(radius: 1)
                            .padding(.horizontal, 18)
                            .padding(.top, 12)
                    }
                    .overlay {
                        RoundedRectangle(cornerRadius: 48, style: .continuous)
                            .stroke(.white.opacity(0.72), lineWidth: 1.5)
                    }
            }
            .shadow(color: color.opacity(0.38), radius: 22, x: 0, y: 14)
        }
        .buttonStyle(.plain)
        .accessibilityLabel(title)
    }
}
