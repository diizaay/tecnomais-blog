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
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://5gvci.com https://quge5.com https://*.profitablecpmratenetwork.com https://www.highperformanceformat.com",
            "worker-src 'self' blob: https://5gvci.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://drive.google.com https://*.profitablecpmratenetwork.com https://quge5.com",
            "connect-src 'self' https://res.cloudinary.com https://www.google-analytics.com https://5gvci.com https://quge5.com https://*.profitablecpmratenetwork.com",
            "frame-src 'self' https://www.highperformanceformat.com",
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
    headers: async () => [
        {
            source: '/(.*)',
            headers: securityHeaders,
        },
        {
            // Long cache for static assets
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

export default nextConfig;
// Trigger redeploy of stable English version

