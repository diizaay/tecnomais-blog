/**
 * Cloudinary Performance Guide
 * 
 * Estratégias implementadas para otimizar imagens:
 */

// ============================================
// 1. COMPRESSÃO E FORMATO
// ============================================
// - q_auto: Qualidade automática (reduz 30-40% sem perda perceptível)
// - f_auto: Formato automático (WebP para Chrome, JPEG fallback)
// - fl_progressive: JPEG progressivo (carrega rápido, depois melhora)

// ============================================
// 2. RESPONSIVIDADE
// ============================================
// - Widths: 480px, 768px, 1200px, 1920px
// - Heights: Proporções mantidas automaticamente
// - Sizes: Diferentes para mobile, tablet, desktop

// ============================================
// 3. ESTRATÉGIA POR TIPO DE IMAGEM
// ============================================

const imageStrategies = {
  // Thumbnails em cards (prioridade: speed)
  thumbnail: {
    width: 500,
    height: 300,
    quality: 'auto',
    transformations: 'q_auto,f_auto,w_500,h_300,c_fill,g_auto,fl_progressive',
    maxFileSize: '50KB',
    description: 'Imagens em cards de artigos'
  },

  // Imagens em hero sections (prioridade: qualidade+speed)
  hero: {
    width: 1920,
    height: 1080,
    quality: 'auto',
    transformations: 'q_auto,f_auto,w_1920,h_1080,c_fill,g_auto,fl_progressive',
    maxFileSize: '200KB',
    description: 'Imagens em seções destaque'
  },

  // Imagens em artigos (prioridade: qualidade)
  article: {
    width: 1200,
    height: 800,
    quality: 'auto',
    transformations: 'q_auto,f_auto,w_1200,h_800,c_fill,g_auto,fl_progressive',
    maxFileSize: '150KB',
    description: 'Imagens dentro de artigos'
  }
};

// ============================================
// 4. RECOMENDAÇÕES DE UPLOAD
// ============================================
const uploadRecommendations = {
  maxFileSize: '5MB',
  formats: ['JPG', 'PNG', 'WebP'],
  quality: 'Alta (85-100%)',
  minWidth: '2400px',
  minHeight: '1600px',
  note: 'Carregue em boa qualidade. O Cloudinary vai otimizar automaticamente.'
};

// ============================================
// 5. CACHE E DELIVERY
// ============================================
const cacheStrategy = {
  // CloudFront CDN automático do Cloudinary
  cacheDuration: '1 year',
  compression: 'gzip automático',
  cdn: 'Global CDN com ~200 pontos de presença',
  http2: 'Suportado para transferência rápida',
  http3: 'Suportado para melhor performance em rede lenta'
};

// ============================================
// 6. MONITORAMENTO DE PERFORMANCE
// ============================================
export const getPerformanceMetrics = {
  // Ferramentas para medir
  tools: [
    'Google PageSpeed Insights',
    'GTmetrix',
    'WebPageTest',
    'Chrome DevTools Lighthouse'
  ],

  // Métricas a acompanhar
  metrics: {
    LCP: 'Largest Contentful Paint (< 2.5s)',
    FID: 'First Input Delay (< 100ms)',
    CLS: 'Cumulative Layout Shift (< 0.1)',
    imageSize: 'Tamanho médio de imagem (< 100KB)',
    totalImageSize: 'Total de imagens por página (< 2MB)'
  },

  // Sugestões de otimização adicional
  additionalOptimizations: [
    'Lazy loading de imagens (implementado)',
    'WebP com fallback (implementado)',
    'Responsive images srcset (implementado)',
    'Compressão de JS/CSS',
    'Minificação de HTML',
    'Cache da aplicação',
    'CDN para assets estáticos'
  ]
};

// ============================================
// 7. EXEMPLO DE TRANSFORMAÇÃO CLOUDINARY
// ============================================
/*
URL Original:
https://res.cloudinary.com/djap3064v/image/upload/seu-arquivo.jpg

URL Otimizada (thumbnail):
https://res.cloudinary.com/djap3064v/image/upload/q_auto,f_auto,w_500,h_300,c_fill,g_auto,fl_progressive/seu-arquivo.jpg

URL Otimizada (hero):
https://res.cloudinary.com/djap3064v/image/upload/q_auto,f_auto,w_1920,h_1080,c_fill,g_auto,fl_progressive/seu-arquivo.jpg
*/

export default {
  strategies: imageStrategies,
  uploadRecommendations,
  cacheStrategy,
  performanceMetrics: getPerformanceMetrics,
};
