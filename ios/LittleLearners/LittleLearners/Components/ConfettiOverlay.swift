import SwiftUI

struct ConfettiOverlay: View {
    let isActive: Bool
    let celebrationID: UUID

    private let pieces = ["⭐", "✨", "💛", "🌸", "💖", "🌟", "🌼", "🎉"]

    var body: some View {
        GeometryReader { proxy in
            if isActive {
                ForEach(0..<36, id: \.self) { index in
                    Text(pieces[index % pieces.count])
                        .font(.system(size: CGFloat(28 + (index % 4) * 5)))
                        .position(
                            x: CGFloat((index * 47) % Int(max(proxy.size.width, 1))),
                            y: -30
                        )
                        .modifier(ConfettiFall(delay: Double(index) * 0.025, height: proxy.size.height))
                        .id("\(celebrationID)-\(index)")
                }
            }
        }
        .allowsHitTesting(false)
    }
}

private struct ConfettiFall: ViewModifier {
    let delay: Double
    let height: CGFloat
    @State private var falling = false

    func body(content: Content) -> some View {
        content
            .offset(y: falling ? height + 80 : 0)
            .rotationEffect(.degrees(falling ? 360 : 0))
            .opacity(falling ? 0 : 1)
            .onAppear {
                withAnimation(.easeOut(duration: 1.55).delay(delay)) {
                    falling = true
                }
            }
    }
}
