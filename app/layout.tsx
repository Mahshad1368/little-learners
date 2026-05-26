import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Little Learners",
  description: "A playful educational web app for children aged 3 to 7.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-display antialiased">
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
