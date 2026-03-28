import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from 'react';
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";
import { getDictionary, Locale } from "@/lib/get-dictionary";
import "../globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'pt' }]
}

export default async function LocaleLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const dict = await getDictionary(lang);

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function(s){s.dataset.zone='10789812',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));
          (function(s){s.dataset.zone='10789820',s.src='https://izcle.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));
        `}} />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className={`${inter.variable} font-sans bg-[#fbfbfd] text-[#1d1d1f] antialiased min-h-screen flex flex-col`}>
        <Suspense fallback={null}>
          <ProgressBar />
        </Suspense>
        <Navbar lang={lang} dict={dict} />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <Footer lang={lang} dict={dict} />
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId="G-XL1PMB2THP" />
      </body>
    </html>
  );
}
