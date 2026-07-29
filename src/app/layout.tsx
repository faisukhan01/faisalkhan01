import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/portfolio/ThemeProvider";
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
  description:
    "Portfolio of Nikita Khvatov, a Full-stack Developer specializing in maintainable, clean and understandable code. 5+ years of experience building modern web applications.",
  keywords: [
    "Full-stack Developer",
    "Portfolio",
    "React",
    "TypeScript",
    "Golang",
    "Next.js",
    "Vue",
    "PostgreSQL",
    "Microservices",
  ],
  authors: [{ name: "Nikita Khvatov" }],
  openGraph: {
    title: "Nikita Khvatov — Full-stack Developer",
    description:
      "Full-stack Developer specializing in maintainable, clean and understandable code. 5+ years of experience.",
    url: "https://nikitakhvatov.dev",
    siteName: "Nikita Khvatov Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nikita Khvatov — Full-stack Developer",
    description:
      "Full-stack Developer specializing in maintainable, clean and understandable code.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
