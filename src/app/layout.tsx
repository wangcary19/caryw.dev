import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import LiveBackground from "@/components/LiveBackground";
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
  description:
    "Cary “Cart” Wang — developer from New York City with a love for languages both computer and human.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen">
        <LiveBackground />
        {children}
      </body>
    </html>
  );
}
