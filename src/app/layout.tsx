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
  metadataBase: new URL('https://agentlaboratories.fun'),
  title: "BOTS - AI-Powered Pump.fun Trading Agents",
  description: "Create and deploy AI trading agents for pump.fun tokens. Automated trading, security scanning, and whale tracking with BOTS.",
  keywords: "AI agents, pump.fun, Solana trading, automated trading, crypto bots, DeFi agents",
  authors: [{ name: "BOTS" }],
  openGraph: {
    title: "BOTS - AI-Powered Pump.fun Trading Agents",
    description: "Create and deploy AI trading agents for pump.fun tokens. Automated trading, security scanning, and whale tracking.",
    url: "https://agentlaboratories.fun",
    siteName: "BOTS",
    images: [
      {
        url: "/pill.png",
        width: 1200,
        height: 630,
        alt: "BOTS - AI Trading Agents for Pump.fun",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BOTS - AI-Powered Pump.fun Trading Agents",
    description: "Create and deploy AI trading agents for pump.fun tokens. Automated trading, security scanning, and whale tracking.",
    images: ["/pill.png"],
    creator: "@aiagent_labs",
  },
  icons: {
    icon: "/pill.png",
    apple: "/pill.png",
    shortcut: "/pill.png"
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
