import SwiftUI

struct GiantToyButton: View {
    let title: String
    let emoji: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 10) {
                Text(emoji)
                    .font(.system(size: 62))
                Text(title)
                    .font(.system(.title2, design: .rounded, weight: .black))
                    .multilineTextAlignment(.center)
                    .minimumScaleFactor(0.72)
            }
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity, minHeight: 154)
            .padding(.horizontal, 16)
            .background(color.gradient, in: RoundedRectangle(cornerRadius: 34, style: .continuous))
            .shadow(color: color.opacity(0.32), radius: 18, x: 0, y: 12)
        }
        .buttonStyle(.plain)
        .accessibilityLabel(title)
    }
}
