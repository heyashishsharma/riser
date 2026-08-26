import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Anton } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#4a3aff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://riser.vercel.app"),
  title: {
    default: "RISER | AI-Powered Influencer Growth",
    template: "%s | RISER",
  },
  description: "Find the best products with AI-powered comparisons, real-world testing, and intelligent search.",
  keywords: ["influencer", "growth", "AI", "sponsorships", "creators"],
  authors: [{ name: "RISER Team" }],
  creator: "RISER",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://riser.vercel.app",
    title: "RISER | AI-Powered Influencer Growth",
    description: "Let your AI Agent analyze your audience & secure sponsorships.",
    siteName: "RISER",
    images: [
      {
        url: "/riser.png", // using the main logo or a specific og-image if available
        width: 1200,
        height: 630,
        alt: "RISER - AI-Powered Influencer Growth",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RISER | AI-Powered Influencer Growth",
    description: "Let your AI Agent analyze your audience & secure sponsorships.",
    images: ["/riser.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
