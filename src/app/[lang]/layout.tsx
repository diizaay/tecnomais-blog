import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";
import { getDictionary, Locale } from "@/lib/get-dictionary";
import { GoogleAnalytics } from '@next/third-parties/google';

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
    <>
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            function loadTag(zone, src, fallback) {
              var s = document.createElement('script');
              s.dataset.zone = zone;
              s.src = src;
              s.onerror = function() {
                var f = document.createElement('script');
                f.dataset.zone = zone;
                f.src = fallback;
                (document.head || document.body).appendChild(f);
              };
              (document.head || document.body).appendChild(s);
            }
            loadTag('10789812', 'https://nap5k.com/tag.min.js', '/media-stream/beta-t/tag.min.js');
            loadTag('10789820', 'https://izcle.com/vignette.min.js', '/media-stream/beta-v/vignette.min.js');


          })();
        `}} />
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
    </>
  );
}
