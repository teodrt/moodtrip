import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/TopNav";
import { Providers } from "@/components/Providers";
import { PerformanceToggle } from "@/components/PerformanceDashboard";
import { SkipToContent } from "@/components/Accessibility";
import { ScreenReaderAnnouncements } from "@/components/Accessibility";
import { KeyboardNavigationIndicator } from "@/components/Accessibility";
import { AccessibilitySettings } from "@/components/Accessibility";
import { ToastProvider } from "@/components/ToastSystem";
// import { ToastProvider } from "@/components/ui/use-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MoodTrip - AI-Powered Travel Planning",
  description: "Plan group trips with AI-generated moodboards, collaborative voting, and smart availability matching.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MoodTrip",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "MoodTrip",
    title: "MoodTrip - AI-Powered Travel Planning",
    description: "Plan group trips with AI-generated moodboards, collaborative voting, and smart availability matching.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MoodTrip - AI-Powered Travel Planning",
    description: "Plan group trips with AI-generated moodboards, collaborative voting, and smart availability matching.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 min-h-screen`}
      >
        <Providers>
          <SkipToContent />
          <ScreenReaderAnnouncements />
          <KeyboardNavigationIndicator />
          <div className="min-h-screen bg-gray-50">
            <TopNav 
              currentGroup="family"
              groups={[
                { slug: 'family', name: 'Family', memberCount: 4 },
                { slug: 'friends', name: 'Friends', memberCount: 6 },
                { slug: 'work', name: 'Work Team', memberCount: 8 },
              ]}
            />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
      <PerformanceToggle />
      <AccessibilitySettings />
      <ToastProvider />
    </Providers>
      </body>
    </html>
  );
}
