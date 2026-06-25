import SwiftUI

struct FloatingChoiceButton: View {
    let token: FloatingToken
    let wrong: Bool
    let action: () -> Void

    @State private var float = false
    private var isTarget: Bool { token.scale > 1.05 }

    var body: some View {
        Button(action: action) {
            Text(token.emoji ?? token.label)
                .font(.system(size: token.emoji == nil ? 64 : 72, weight: .black, design: .rounded))
                .foregroundStyle(token.emoji == nil && isTarget ? ToyTheme.berry : token.emoji == nil ? ToyTheme.ink : .primary)
                .frame(width: token.emoji == nil ? 118 : 132, height: token.emoji == nil ? 118 : 132)
                .background(backgroundFill, in: RoundedRectangle(cornerRadius: token.emoji == nil ? 59 : 34, style: .continuous))
                .overlay(alignment: .topLeading) {
                    if isTarget && !wrong {
                        RoundedRectangle(cornerRadius: token.emoji == nil ? 59 : 34, style: .continuous)
                            .fill(.white.opacity(0.34))
                            .frame(width: token.emoji == nil ? 78 : 88, height: 32)
                            .offset(x: 16, y: 13)
                            .blur(radius: 1)
                    }
                }
                .overlay {
                    if isTarget && !wrong {
                        RoundedRectangle(cornerRadius: token.emoji == nil ? 59 : 34, style: .continuous)
                            .stroke(ToyTheme.banana.opacity(float ? 0.95 : 0.45), lineWidth: 8)
                    }
                }
                .shadow(color: isTarget ? ToyTheme.banana.opacity(0.48) : ToyTheme.ink.opacity(0.14), radius: isTarget ? 28 : 14, x: 0, y: isTarget ? 18 : 10)
                .scaleEffect(float && isTarget ? token.scale * 1.09 : token.scale)
                .rotationEffect(.degrees(wrong ? (float ? -9 : 9) : (float ? 8 : -6)))
                .saturation(isTarget ? 1.35 : 0.72)
                .opacity(isTarget ? 1 : 0.68)
        }
        .buttonStyle(.plain)
        .offset(x: float ? token.driftX : -token.driftX, y: float ? -token.driftY : token.driftY)
        .animation(.easeInOut(duration: token.duration).repeatForever(autoreverses: true), value: float)
        .animation(.default, value: wrong)
        .onAppear { float = true }
        .accessibilityLabel(token.label)
    }

    private var backgroundFill: LinearGradient {
        if wrong {
            return LinearGradient(colors: [Color.red.opacity(0.86), Color.red.opacity(0.66)], startPoint: .topLeading, endPoint: .bottomTrailing)
        }
        if isTarget {
            return LinearGradient(colors: [ToyTheme.banana.opacity(0.98), Color.white.opacity(0.86), ToyTheme.banana.opacity(0.92)], startPoint: .topLeading, endPoint: .bottomTrailing)
        }
        let softColor = Color(hue: token.colorHue / 360, saturation: 0.58, brightness: 0.98)
        return LinearGradient(colors: [softColor.opacity(0.62), Color.white.opacity(0.48)], startPoint: .topLeading, endPoint: .bottomTrailing)
    }
}
