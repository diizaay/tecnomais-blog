import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // faster font loading
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tecnomais.online";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TecnoMais - Transforming Ideas into Innovation",
    template: "%s | TecnoMais",
  },
  description: "Your premium publication for AI tools, software engineering, and global technology trends.",
  keywords: ["tech", "technology", "AI", "artificial intelligence", "software", "programming", "Angola", "Africa"],
  authors: [{ name: "TecnoMais" }],
  creator: "TecnoMais",
  publisher: "TecnoMais",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_AO",
    alternateLocale: ["en_US"],
    url: siteUrl,
    siteName: "TecnoMais",
    title: "TecnoMais - Transforming Ideas into Innovation",
    description: "Your premium publication for AI tools, software engineering, and global technology trends.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TecnoMais",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TecnoMais",
    description: "Your premium publication for AI tools, software engineering, and global technology trends.",
    images: ["/og-image.png"],
  },
  icons: {
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className={`${inter.variable} font-sans bg-[#fbfbfd] text-[#1d1d1f] antialiased min-h-screen flex flex-col`}>
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
