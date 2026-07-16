import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { contact, summary, experience, education } from "@/data/resume";
import ParticleField from "@/components/ParticleField";
import { SITE_URL } from "@/lib/site-config";

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
  metadataBase: new URL(SITE_URL),
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${contact.name} — ${contact.title}`,
    description: summary,
    type: "profile",
    url: SITE_URL,
    siteName: `${contact.name} — Portfolio`,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${contact.name} — ${contact.title}`,
    description: summary,
  },
  verification: {
    google: "RkIvl_qZk_hbw_zEegKtrgaFc2SCplKWXID-SvRPnp8",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: contact.name,
  jobTitle: contact.title,
  description: summary,
  url: SITE_URL,
  image: `${SITE_URL}/images/profile-v2.jpg`,
  email: `mailto:${contact.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: contact.location,
    addressCountry: "IN",
  },
  worksFor: {
    "@type": "Organization",
    name: experience[0].company,
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: education[0].school,
  },
  knowsAbout: [
    "SAP ABAP",
    "SAP BTP",
    "SAP S/4HANA",
    "SAP CAP",
    "SAPUI5",
    "ABAP CDS",
    "OData",
    "SAP Build Process Automation",
    "Adobe Forms",
  ],
  sameAs: [contact.linkedinUrl, contact.githubUrl],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ParticleField />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
