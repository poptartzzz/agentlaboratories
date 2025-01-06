import type { Metadata } from "next";
import { Press_Start_2P } from 'next/font/google';
import "./globals.css";
import Script from 'next/script';
import ChatBot from '@/components/ChatBot';

const pressStart = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "AGENTZ AI",
  description: "Next-Gen AI Agents - Your 24/7 Crypto Companion",
  icons: {
    icon: "/agentzaimainmain.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script 
          src="https://unpkg.com/@splinetool/viewer@1.9.56/build/spline-viewer.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={pressStart.className}>
        {children}
        <ChatBot />
      </body>
    </html>
  );
}
