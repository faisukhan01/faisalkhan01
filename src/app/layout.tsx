import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Nikita Khvatov — Full-stack Developer",
  description: "Portfolio of Nikita Khvatov, a Full-stack Developer specializing in maintainable, clean and understandable code.",
  keywords: ["Full-stack Developer", "Portfolio", "React", "TypeScript", "Golang"],
  authors: [{ name: "Nikita Khvatov" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-[#0D0D0D] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
