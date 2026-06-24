import SwiftUI

struct ToyBackground: View {
    var body: some View {
        ZStack {
            ToyTheme.background.ignoresSafeArea()
            Circle()
                .fill(ToyTheme.banana.opacity(0.32))
                .frame(width: 220, height: 220)
                .blur(radius: 2)
                .offset(x: -170, y: -280)
            Circle()
                .fill(ToyTheme.mint.opacity(0.24))
                .frame(width: 260, height: 260)
                .blur(radius: 3)
                .offset(x: 180, y: 280)
            Circle()
                .fill(ToyTheme.berry.opacity(0.14))
                .frame(width: 180, height: 180)
                .blur(radius: 4)
                .offset(x: 150, y: -190)
        }
    }
}
