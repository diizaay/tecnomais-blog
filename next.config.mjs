/** @type {import('next').NextConfig} */
const nextConfig = {
        eslint: {
            ignoreDuringBuilds: true,
        },
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
        // Otimizações de imagem
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        // Cache de imagens otimizadas por 1 ano
        minimumCacheTTL: 31536000,
        // Usar novo formato de otimização (mais rápido)
        formats: ['image/avif', 'image/webp'],
    },
    webpack: (config, { webpack, isServer }) => {
        if (!isServer) {
            // Provide Quill globally for modules that expect window.Quill
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
