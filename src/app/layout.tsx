import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
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

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Faisal Khan — Full-stack Developer",
  description:
    "Portfolio of Faisal Khan, a Full-stack Developer specializing in maintainable, clean and understandable code. 5+ years of experience building modern web applications.",
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
  authors: [{ name: "Faisal Khan" }],
  openGraph: {
    title: "Faisal Khan — Full-stack Developer",
    description:
      "Full-stack Developer specializing in maintainable, clean and understandable code. 5+ years of experience.",
    url: "https://faisalkhan.dev",
    siteName: "Faisal Khan Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Faisal Khan — Full-stack Developer",
    description:
      "Full-stack Developer specializing in modern web applications, clean code, and scalable solutions.",
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
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${sourceSerif4.variable} antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Faisal Khan",
              url: "https://faisalkhan.dev",
              image: "https://faisalkhan.dev/profile.png",
              jobTitle: "Full-stack Developer",
              description:
                "Full-stack Developer specializing in maintainable, clean and understandable code. 5+ years of experience building modern web applications.",
              knowsAbout: [
                "React",
                "TypeScript",
                "Next.js",
                "Golang",
                "Node.js",
                "PostgreSQL",
                "Microservices",
                "Docker",
                "AWS",
                "Vue",
              ],
              sameAs: [
                "https://github.com/faisalkhan",
                "https://www.linkedin.com/in/faisalkhan",
                "https://t.me/faisalkhan",
              ],
              worksFor: {
                "@type": "Organization",
                name: "Independent",
              },
              address: {
                "@type": "PostalAddress",
                addressCountry: "PK",
              },
            }),
          }}
        />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
