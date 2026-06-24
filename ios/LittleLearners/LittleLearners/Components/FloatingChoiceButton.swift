import SwiftUI

struct FloatingChoiceButton: View {
    let token: FloatingToken
    let wrong: Bool
    let action: () -> Void

    @State private var float = false

    var body: some View {
        Button(action: action) {
            Text(token.emoji ?? token.label)
                .font(.system(size: token.emoji == nil ? 64 : 72, weight: .black, design: .rounded))
                .foregroundStyle(token.emoji == nil ? ToyTheme.ink : .primary)
                .frame(width: token.emoji == nil ? 118 : 132, height: token.emoji == nil ? 118 : 132)
                .background(wrong ? Color.red.opacity(0.82) : ToyTheme.banana.opacity(0.92), in: RoundedRectangle(cornerRadius: token.emoji == nil ? 59 : 34, style: .continuous))
                .shadow(color: ToyTheme.ink.opacity(0.20), radius: 18, x: 0, y: 12)
                .scaleEffect(token.scale)
                .rotationEffect(.degrees(wrong ? (float ? -7 : 7) : (float ? 4 : -4)))
        }
        .buttonStyle(.plain)
        .offset(x: float ? token.driftX : -token.driftX, y: float ? -token.driftY : token.driftY)
        .animation(.easeInOut(duration: token.duration).repeatForever(autoreverses: true), value: float)
        .animation(.default, value: wrong)
        .onAppear { float = true }
        .accessibilityLabel(token.label)
    }
}
