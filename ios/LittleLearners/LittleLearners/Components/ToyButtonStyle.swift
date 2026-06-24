import SwiftUI

extension View {
    func primaryToyButton(color: Color, foreground: Color = .white) -> some View {
        self
            .font(.system(.headline, design: .rounded, weight: .black))
            .foregroundStyle(foreground)
            .frame(maxWidth: .infinity, minHeight: 56)
            .background(color.gradient, in: RoundedRectangle(cornerRadius: 21, style: .continuous))
            .shadow(color: color.opacity(0.25), radius: 12, x: 0, y: 8)
    }
}
