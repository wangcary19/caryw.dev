import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BlueHaze from "@/components/BlueHaze";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cary Wang",
  description: "Personal website and writing of Cary Wang — software engineer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen">
        <BlueHaze />
        {children}
      </body>
    </html>
  );
}
