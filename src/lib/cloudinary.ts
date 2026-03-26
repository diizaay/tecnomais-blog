/**
 * Cloudinary Image Optimization Utility
 * Automatiza transformações para performance
 */

/**
 * Extrai o public ID de uma URL do Cloudinary
 * Exemplo: https://res.cloudinary.com/cloud/image/upload/v123/blog-uploads/abc123.jpg
 * Retorna: blog-uploads/abc123
 */
export const extractPublicIdFromUrl = (url: string): string => {
  try {
    // Se não for uma URL, é um public ID direto
    if (!url.includes('/')) {
      return url;
    }
    
    // Detecta se é URL Cloudinary
    if (url.includes('res.cloudinary.com')) {
      const urlParts = url.split('/image/upload/');
      if (urlParts.length < 2) return '';
      
      let path = urlParts[1];
      
      // Remove versão (v123/)
      path = path.replace(/^v\d+\//, '');
      
      // Remove extensão e tudo após
      const withoutExt = path.split('.')[0];
      
      return withoutExt;
    }
    
    // Se for outra URL (Unsplash, etc), não é válida para Cloudinary
    if (url.startsWith('http')) {
      return '';
    }
    
    // Caso contrário, é um public ID direto (pode conter /)
    return url.split('.')[0];
  } catch (error) {
    console.error('Erro ao extrair public ID:', error);
    return '';
  }
};

export const getOptimizedImageUrl = (
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: 'auto' | 'low' | 'medium' | 'high';
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    aspectRatio?: string;
  }
) => {
  const {
    width = 1200,
    height,
    quality = 'auto',
    format = 'auto',
    aspectRatio,
  } = options || {};

  const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'djap3064v').trim();

  if (!publicId) {
    console.warn('publicId não fornecido para getOptimizedImageUrl');
    return '';
  }

  // Garante que publicId não contém extensão de arquivo
  const cleanPublicId = publicId.split('.')[0];

  // Transformações Cloudinary para otimização agressiva
  const transformations = [
    // 1. Qualidade baseada no parâmetro ou auto
    `q_auto:${quality === 'auto' ? 'eco' : quality === 'low' ? 'eco' : quality === 'medium' ? 'good' : 'best'}`,
    // 2. Formato automático (WebP para browsers modernos, JPEG fallback)
    `f_${format}`,
    // 3. Redimensionamento responsivo com compressão
    ...(width ? [`w_${width}`] : []),
    ...(height ? [`h_${height}`] : []),
    // 4. Modo de preenchimento com gravity
    'c_fill',
    'g_auto',
    // 5. Entrega de imagem progressiva
    'fl_progressive',
    // 6. Remover dados EXIF para reduzir tamanho
    'fl_strip_profile',
  ];

  const url = `https://res.cloudinary.com/${cloudName}/image/upload/${transformations.join(
    ','
  )}/${cleanPublicId}.jpg`; // Força JPEG como fallback

  return url;
};

/**
 * URLs otimizadas para thumbnail (reduz agressivamente)
 */
export const getThumbnailUrl = (publicId: string): string => {
  const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'djap3064v').trim();
  
  if (!publicId) return '';

  // Garante que publicId não contém extensão de arquivo
  const cleanPublicId = publicId.split('.')[0];

  const transformations = [
    'q_auto:eco',          // Qualidade automática otimizada para banda
    'f_auto',              // Formato automático
    'w_500',               // Largura para thumbnail
    'h_300',               // Altura para thumbnail
    'c_fill',
    'g_auto',
    'fl_progressive',
    'fl_strip_profile',    // Remove EXIF
  ];

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations.join(',')}/${cleanPublicId}.jpg`;
};

/**
 * URLs otimizadas para hero/featured images
 */
export const getHeroImageUrl = (publicId: string): string => {
  const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'djap3064v').trim();
  
  if (!publicId) return '';

  // Garante que publicId não contém extensão de arquivo
  const cleanPublicId = publicId.split('.')[0];

  const transformations = [
    'q_auto:best',         // Melhor qualidade automática
    'f_auto',              // Formato automático
    'w_1600',              // Reduzido de 1920 para 1600 para melhor performance
    'c_fill',
    'g_auto',
    'fl_progressive',
    'fl_strip_profile',    // Remove EXIF
  ];

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations.join(',')}/${cleanPublicId}.jpg`;
};

/**
 * Gera uma URL de placeholder borrada (LQIP)
 */
export const getBlurPlaceholderUrl = (publicId: string): string => {
  const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'djap3064v').trim();
  if (!publicId) return '';

  const cleanPublicId = publicId.split('.')[0];
  const transformations = [
    'w_40',               // Extremamente pequeno
    'e_blur:2000',        // Muito borrado
    'q_auto:low',         // Qualidade mínima
    'f_auto',
  ];

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations.join(',')}/${cleanPublicId}.jpg`;
};

/**
 * URLs otimizadas para diferentes tamanhos
 */
export const getResponsiveImageSrcSet = (publicId: string) => {
  const sizes = {
    mobile: { width: 480, height: 320 },
    tablet: { width: 768, height: 512 },
    desktop: { width: 1200, height: 800 },
    featured: { width: 1920, height: 1080 },
  };

  const srcSet: Record<string, string> = {};

  Object.entries(sizes).forEach(([key, { width, height }]) => {
    srcSet[key] = getOptimizedImageUrl(publicId, {
      width,
      height,
      quality: 'auto',
      format: 'auto',
    });
  });

  return srcSet;
};
