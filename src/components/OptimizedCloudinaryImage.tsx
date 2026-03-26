import Image from 'next/image';
import { extractPublicIdFromUrl, getOptimizedImageUrl, getBlurPlaceholderUrl } from '@/lib/cloudinary';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: 'auto' | 'low' | 'medium' | 'high';
  type?: 'thumbnail' | 'hero' | 'default';
  priority?: boolean;
  fill?: boolean;
  className?: string;
  sizes?: string;
}

/**
 * Componente Image otimizado para Cloudinary
 * Implementa Blur Placeholder (LQIP) para melhor performance percebida
 */
export default function OptimizedCloudinaryImage({
  src,
  alt,
  width = 1200,
  height = 800,
  quality = 'auto',
  type = 'default',
  priority = false,
  fill = false,
  className = '',
  sizes,
}: OptimizedImageProps) {

  // Se for URL relativa com /, use como está
  if (src.startsWith('/')) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={className}
        sizes={sizes}
        quality={90}
      />
    );
  }

  // Verifica se é URL Cloudinary
  const publicId = extractPublicIdFromUrl(src);
  const isCloudinary = !!publicId && (src.includes('res.cloudinary.com') || !src.startsWith('http'));

  if (!isCloudinary) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={className}
        sizes={sizes}
        unoptimized={true}
      />
    );
  }

  // Escolher URL otimizada e placeholder
  let optimizedUrl = '';
  let blurDataURL = '';

  if (type === 'thumbnail') {
    optimizedUrl = getOptimizedImageUrl(publicId, {
      width: width || 600,
      height: height || 400,
      quality: 'low',
    });
  } else if (type === 'hero') {
    // getHeroImageUrl agora usa 1600px para melhor equilíbrio entre qualidade e peso
    const transformations = [
        'q_auto:best',
        'f_auto',
        'w_1600',
        'h_900',
        'c_fill',
        'g_auto',
        'fl_progressive'
    ];
    optimizedUrl = `https://res.cloudinary.com/${(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'djap3064v').trim()}/image/upload/${transformations.join(',')}/${publicId}.jpg`;
  } else {
    optimizedUrl = getOptimizedImageUrl(publicId, {
      width,
      height,
      quality,
    });
  }

  blurDataURL = getBlurPlaceholderUrl(publicId);

  // Sizes responsivos padrão melhorados
  const defaultSizes =
    type === 'hero'
      ? '100vw'
      : type === 'thumbnail'
        ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        : '(max-width: 1200px) 100vw, 1200px';

  return (
    <Image
      src={optimizedUrl}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      priority={priority}
      className={className}
      sizes={sizes || defaultSizes}
      placeholder="blur"
      blurDataURL={blurDataURL}
      quality={95}
    />
  );
}
