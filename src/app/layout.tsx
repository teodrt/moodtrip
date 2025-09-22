import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/TopNav";
import { PostHogProvider } from "@/components/PostHogProvider";
import { ToastProvider } from "@/components/ui/use-toast";

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
        <PostHogProvider>
          <ToastProvider>
            <div className="min-h-screen bg-gray-50">
              <TopNav 
                currentGroup="family"
                groups={[
                  { slug: 'family', name: 'Family', memberCount: 4 },
                  { slug: 'friends', name: 'Friends', memberCount: 6 },
                  { slug: 'work', name: 'Work Team', memberCount: 8 },
                ]}
              />
              {children}
            </div>
          </ToastProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
