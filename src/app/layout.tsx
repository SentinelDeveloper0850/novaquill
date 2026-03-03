import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/Header";
import { ErrorBoundary } from "@/components/ErrorBoundary";

function getSiteUrl(): string {
  const candidate = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  try {
    return new URL(candidate).toString();
  } catch {
    return "http://localhost:3000";
  }
}

const siteUrl = getSiteUrl();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NovaQuill — Upload. Sign. Download.",
  description:
    "NovaQuill is a minimalist, global e‑signing tool. Upload → Sign → Download.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "NovaQuill — Upload. Sign. Download.",
    description:
      "Ultra-simple e‑signing with ShapeAssist real-time smoothing. Free and Pro.",
    url: siteUrl,
    siteName: "NovaQuill",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ErrorBoundary>
          <Providers>
            <Header />
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
