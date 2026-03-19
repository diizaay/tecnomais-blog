import Image from 'next/image';
import { extractPublicIdFromUrl, getOptimizedImageUrl, getThumbnailUrl, getHeroImageUrl } from '@/lib/cloudinary';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: 'auto' | 'low' | 'medium' | 'high';
  type?: 'thumbnail' | 'hero' | 'default';
  priority?: boolean;
  className?: string;
  sizes?: string;
}

/**
 * Componente Image otimizado para Cloudinary
 * Reduz automaticamente tamanho de arquivo sem perder qualidade
 */
export default function OptimizedCloudinaryImage({
  src,
  alt,
  width = 1200,
  height = 800,
  quality = 'auto',
  type = 'default',
  priority = false,
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
        loading={priority ? 'eager' : 'lazy'}
        quality={90}
      />
    );
  }

  // Se for URL Cloudinary DEMO (ex: .../image/upload/w_1200,h_800,c_fill/1), usar a mesma URL para thumbnail
  if (src.startsWith('http') && src.includes('res.cloudinary.com/demo/image/upload/') && /\/\d+$/.test(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={className}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        quality={90}
        unoptimized={true}
      />
    );
  }

  // Se for URL externa (Unsplash, etc), não tenta otimizar
  if (src.startsWith('http') && !src.includes('res.cloudinary.com')) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={className}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        quality={90}
        unoptimized={true}
      />
    );
  }

  // Verifica se é URL Cloudinary
  let publicId = '';
  let optimizedUrl = '';
  
  if (src.includes('res.cloudinary.com')) {
    // Extrai o public ID de uma URL Cloudinary completa
    publicId = extractPublicIdFromUrl(src);
  } else {
    // Trata como public ID direto
    publicId = src;
  }

  // Escolher URL otimizada baseado no tipo
  if (type === 'thumbnail') {
    // Se for Cloudinary demo, use a URL original sem transformação
    if (src.startsWith('http') && src.includes('res.cloudinary.com/demo/image/upload/') && /\/\d+$/.test(src)) {
      optimizedUrl = src;
    } else {
      optimizedUrl = getOptimizedImageUrl(publicId, {
        width: width || 500,
        height: height || 300,
        quality: 'low',  // Mais agressivo para thumbnails
        format: 'auto',
      });
    }
  } else if (type === 'hero') {
    // Para hero, mantém as dimensões padrão
    optimizedUrl = getHeroImageUrl(publicId);
  } else {
    optimizedUrl = getOptimizedImageUrl(publicId, {
      width,
      height,
      quality,
      format: 'auto',
    });
  }

  // Fallback se não conseguir processar
  if (!optimizedUrl || !optimizedUrl.startsWith('http')) {
    // Se ainda assim não temos uma URL válida, trata como public ID
    const fallbackUrl = getOptimizedImageUrl(publicId || src, {
      width,
      height,
      quality,
      format: 'auto',
    });
    
    if (!fallbackUrl || !fallbackUrl.startsWith('http')) {
      // Last resort - return com fallback simples
      return (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className={className}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          quality={90}
          unoptimized={true}
        />
      );
    }
    
    optimizedUrl = fallbackUrl;
  }

  // Sizes responsivos padrão
  const defaultSizes =
    type === 'hero'
      ? '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw'
      : type === 'thumbnail'
        ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
        : '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px';

  // Se for Cloudinary, não reotimizar
  const isCloudinary = optimizedUrl.includes('res.cloudinary.com');
  return (
    <Image
      src={optimizedUrl}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      sizes={sizes || defaultSizes}
      loading={priority ? 'eager' : 'lazy'}
      quality={90}
      unoptimized={isCloudinary}
    />
  );
}
