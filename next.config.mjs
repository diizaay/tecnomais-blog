/** @type {import('next').NextConfig} */

const securityHeaders = [
    {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
    },
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
    },
    {
        key: 'X-Frame-Options',
        value: 'DENY',
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
    },
    {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
    },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
    },
    {
        key: 'X-Powered-By',
        value: '',
    },
    {
        key: 'Content-Security-Policy',
        value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://5gvci.com https://quge5.com https://nap5k.com https://*.nap5k.com https://izcle.com https://*.izcle.com https://jhnwr.com https://*.jhnwr.com https://ohffs.com https://*.ohffs.com https://kettledroopingcontinuation.com https://*.kettledroopingcontinuation.com https://tzegilo.com https://*.tzegilo.com https://cdn.storageimagedisplay.com https://*.cdn.storageimagedisplay.com https://profitablecpmratenetwork.com https://*.profitablecpmratenetwork.com https://highperformanceformat.com https://*.highperformanceformat.com https://preferencenail.com https://*.preferencenail.com https://realizationnewestfangs.com https://*.realizationnewestfangs.com https://6opo.com https://*.6opo.com https://protrafficinspector.com https://*.protrafficinspector.com https://wayfarerorthodox.com https://*.wayfarerorthodox.com https://rtmark.net https://*.rtmark.net https://adsterratechnology.com https://*.adsterratechnology.com https://onclickads.net https://*.onclickads.net https://hilltopads.com https://*.hilltopads.com https://furiousexpansion.com https://*.furiousexpansion.com https://sourshaped.com https://*.sourshaped.com https://adsterratools.com https://*.adsterratools.com",
            "worker-src 'self' blob: https://5gvci.com https://onclickads.net https://*.onclickads.net https://highperformanceformat.com https://*.highperformanceformat.com https://profitablecpmratenetwork.com https://*.profitablecpmratenetwork.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://drive.google.com https://profitablecpmratenetwork.com https://*.profitablecpmratenetwork.com https://quge5.com https://nap5k.com https://*.nap5k.com https://izcle.com https://*.izcle.com https://jhnwr.com https://*.jhnwr.com https://ohffs.com https://*.ohffs.com https://bobapsoabauns.com https://*.bobapsoabauns.com https://kettledroopingcontinuation.com https://*.kettledroopingcontinuation.com https://tzegilo.com https://*.tzegilo.com https://cdn.storageimagedisplay.com https://*.cdn.storageimagedisplay.com https://skinnycrawlinglax.com https://*.skinnycrawlinglax.com https://wayfarerorthodox.com https://*.wayfarerorthodox.com https://rtmark.net https://*.rtmark.net https://realizationnewestfangs.com https://*.realizationnewestfangs.com https://flushpersist.com https://*.flushpersist.com https://sleepoverlimitprofound.com https://*.sleepoverlimitprofound.com https://fizzyacerbitymellow.com https://*.fizzyacerbitymellow.com https://exemplarfederallithe.com https://*.exemplarfederallithe.com https://furiousexpansion.com https://*.furiousexpansion.com https://sourshaped.com https://*.sourshaped.com https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://onclickads.net https://*.onclickads.net https://adsterratools.com https://*.adsterratools.com https://steeptouch.com https://*.steeptouch.com https://pawsomepets.club https://*.pawsomepets.club https://clippingbeads.com https://*.clippingbeads.com https://greenishyellow.com https://*.greenishyellow.com https://consumeririssalary.com https://*.consumeririssalary.com https://diligentspelling.com https://*.diligentspelling.com https://graciousnessmellow.com https://*.graciousnessmellow.com https://monetag.com https://*.monetag.com https://growth-profit.com https://*.growth-profit.com https://fast-profit.net https://*.fast-profit.net https://futuretechdelivery.com https://*.futuretechdelivery.com https://hilltopads.com https://*.hilltopads.com",
            "connect-src 'self' https://res.cloudinary.com https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://5gvci.com https://quge5.com https://nap5k.com https://*.nap5k.com https://izcle.com https://*.izcle.com https://jhnwr.com https://*.jhnwr.com https://ohffs.com https://*.ohffs.com https://kettledroopingcontinuation.com https://*.kettledroopingcontinuation.com https://tzegilo.com https://*.tzegilo.com https://cdn.storageimagedisplay.com https://*.cdn.storageimagedisplay.com https://profitablecpmratenetwork.com https://*.profitablecpmratenetwork.com https://highperformanceformat.com https://*.highperformanceformat.com https://preferencenail.com https://*.preferencenail.com https://realizationnewestfangs.com https://*.realizationnewestfangs.com https://6opo.com https://*.6opo.com https://protrafficinspector.com https://*.protrafficinspector.com https://wayfarerorthodox.com https://*.wayfarerorthodox.com https://rtmark.net https://*.rtmark.net https://skinnycrawlinglax.com https://*.skinnycrawlinglax.com https://fleraprt.com https://*.fleraprt.com https://sleepoverlimitprofound.com https://*.sleepoverlimitprofound.com https://fizzyacerbitymellow.com https://*.fizzyacerbitymellow.com https://exemplarfederallithe.com https://*.exemplarfederallithe.com https://furiousexpansion.com https://*.furiousexpansion.com https://sourshaped.com https://*.sourshaped.com https://onclickads.net https://*.onclickads.net https://adsterratools.com https://*.adsterratools.com https://steeptouch.com https://*.steeptouch.com https://pawsomepets.club https://*.pawsomepets.club https://clippingbeads.com https://*.clippingbeads.com https://greenishyellow.com https://*.greenishyellow.com https://consumeririssalary.com https://*.consumeririssalary.com https://diligentspelling.com https://*.diligentspelling.com https://graciousnessmellow.com https://*.graciousnessmellow.com https://monetag.com https://*.monetag.com https://growth-profit.com https://*.growth-profit.com https://fast-profit.net https://*.fast-profit.net https://futuretechdelivery.com https://*.futuretechdelivery.com https://hilltopads.com https://*.hilltopads.com",
            "frame-src 'self' https://nap5k.com https://*.nap5k.com https://izcle.com https://*.izcle.com https://jhnwr.com https://*.jhnwr.com https://ohffs.com https://*.ohffs.com https://kettledroopingcontinuation.com https://*.kettledroopingcontinuation.com https://tzegilo.com https://*.tzegilo.com https://cdn.storageimagedisplay.com https://*.cdn.storageimagedisplay.com https://highperformanceformat.com https://*.highperformanceformat.com https://realizationnewestfangs.com https://*.realizationnewestfangs.com https://profitablecpmratenetwork.com https://*.profitablecpmratenetwork.com https://wayfarerorthodox.com https://*.wayfarerorthodox.com https://rtmark.net https://*.rtmark.net https://sourshaped.com https://*.sourshaped.com https://furiousexpansion.com https://*.furiousexpansion.com https://onclickads.net https://*.onclickads.net https://adsterratools.com https://*.adsterratools.com https://steeptouch.com https://*.steeptouch.com https://pawsomepets.club https://*.pawsomepets.club https://clippingbeads.com https://*.clippingbeads.com https://greenishyellow.com https://*.greenishyellow.com https://consumeririssalary.com https://*.consumeririssalary.com https://diligentspelling.com https://*.diligentspelling.com https://graciousnessmellow.com https://*.graciousnessmellow.com https://monetag.com https://*.monetag.com https://growth-profit.com https://*.growth-profit.com https://fast-profit.net https://*.fast-profit.net https://futuretechdelivery.com https://*.futuretechdelivery.com https://hilltopads.com https://*.hilltopads.com",
            "child-src 'self' https://highperformanceformat.com https://*.highperformanceformat.com https://realizationnewestfangs.com https://*.realizationnewestfangs.com https://profitablecpmratenetwork.com https://*.profitablecpmratenetwork.com https://wayfarerorthodox.com https://*.wayfarerorthodox.com https://rtmark.net https://*.rtmark.net https://sourshaped.com https://*.sourshaped.com https://furiousexpansion.com https://*.furiousexpansion.com https://onclickads.net https://*.onclickads.net https://steeptouch.com https://*.steeptouch.com https://pawsomepets.club https://*.pawsomepets.club",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests",
        ].join('; '),
    },
]

const nextConfig = {
    poweredByHeader: false,
    compress: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    rewrites: async () => [
        {
            source: '/ads-proxy/adsterra/:path*',
            destination: 'https://www.highperformanceformat.com/:path*',
        },
        {
            source: '/ads-proxy/adsterra-static/:path*',
            destination: 'https://www.adsterratools.com/:path*',
        },
        {
            source: '/ads-proxy/adsterra-click/:path*',
            destination: 'https://onclickads.net/:path*',
        },
        {
            source: '/ads-proxy/adsterra-decoy/:path*',
            destination: 'https://realizationnewestfangs.com/:path*',
        },
        {
            source: '/ads-proxy/monetag/:path*',
            destination: 'https://pl28985299.profitablecpmratenetwork.com/:path*',
        },
        {
            source: '/ads-proxy/adsterra-tech/:path*',
            destination: 'https://adsterratechnology.com/:path*',
        },
        {
            source: '/ads-proxy/adsterra-rtm/:path*',
            destination: 'https://rtmark.net/:path*',
        },
        {
            source: '/ads-proxy/adsterra-myrtm/:path*',
            destination: 'https://my.rtmark.net/:path*',
        },
    ],
    headers: async () => [
        {
            source: '/(.*)',
            headers: securityHeaders,
        },
        {
            source: '/(.*)\\.(ico|png|jpg|jpeg|svg|webp|avif|woff|woff2)',
            headers: [
                {
                    key: 'Cache-Control',
                    value: 'public, max-age=31536000, immutable',
                },
            ],
        },
    ],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'drive.google.com',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
        ],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
        minimumCacheTTL: 31536000,
        formats: ['image/avif', 'image/webp'],
    },
    webpack: (config, { webpack, isServer }) => {
        if (!isServer) {
            config.plugins.push(
                new webpack.ProvidePlugin({
                    'window.Quill': 'quill'
                })
            );
        }
        return config;
    },
};

// Force redeploy and cache invalidation: 2026-03-28T15:36:00Z
export default nextConfig;
