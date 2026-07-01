import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { contact, summary } from "@/data/resume";
import LiquidEther from "@/components/LiquidEther";

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');var theme=(t==='light'||t==='dark')?t:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.theme=theme;}catch(e){}})();`;

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${contact.name} — ${contact.title}`,
  description: summary,
  keywords: [
    "Boopalan M",
    "SAP ABAP Consultant",
    "SAP BTP Consultant",
    "SAP CAP",
    "SAPUI5",
    "S/4HANA",
    "Portfolio",
  ],
  openGraph: {
    title: `${contact.name} — ${contact.title}`,
    description: summary,
    type: "profile",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] font-sans antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <LiquidEther />
        {children}
      </body>
    </html>
  );
}
