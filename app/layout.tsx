import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/providers/app-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StockPro",
  description: "Inventory, sales and finance management",
};

const analyticsScriptUrl = process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL;
const analyticsWebsiteKey = process.env.NEXT_PUBLIC_ANALYTICS_WEBSITE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AppProvider>{children}</AppProvider>

        {analyticsScriptUrl && analyticsWebsiteKey ? (
          <Script
            id="stockpro-analytics"
            src={analyticsScriptUrl}
            data-website-key={analyticsWebsiteKey}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}