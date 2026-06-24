import SwiftUI

struct MascotPrompt: View {
    let mascot: String
    let prompt: String
    var compact = false

    @State private var bounce = false

    var body: some View {
        VStack(spacing: compact ? 4 : 8) {
            Text(mascot)
                .font(.system(size: compact ? 54 : 78))
                .frame(width: compact ? 86 : 124, height: compact ? 86 : 124)
                .background(.white.opacity(0.74), in: Circle())
                .shadow(color: ToyTheme.ink.opacity(0.14), radius: 14, x: 0, y: 8)
                .offset(y: bounce ? -8 : 4)
            Text(prompt)
                .font(.system(compact ? .title2 : .largeTitle, design: .rounded, weight: .black))
                .foregroundStyle(ToyTheme.berry)
                .padding(.horizontal, 18)
                .padding(.vertical, 9)
                .background(.white.opacity(0.72), in: Capsule())
        }
        .onAppear {
            withAnimation(.easeInOut(duration: 1.4).repeatForever(autoreverses: true)) {
                bounce = true
            }
        }
    }
}
