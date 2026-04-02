import { NextRequest, NextResponse } from 'next/server';

const DOMAIN_MAP: Record<string, string> = {
  'alpha': 'https://www.highperformanceformat.com',
  'alpha-c': 'https://onclickads.net',
  'alpha-t': 'https://adsterratechnology.com',
  'alpha-s': 'https://www.adsterratools.com',
  'alpha-g': 'https://www.highcpmgate.com',
  'alpha-r': 'https://www.highrateadvertisement.com',
  'beta': 'https://pl28985299.profitablecpmratenetwork.com',
  'beta-t': 'https://nap5k.com',
  'beta-v': 'https://izcle.com',
  'gamma': 'https://rtmark.net',
  'gamma-m': 'https://my.rtmark.net',
  'delta': 'https://5gvci.com',
  'epsilon': 'https://ldrws.com',
};

// High-reliability static mirror for the main Adsterra key to bypass 403 blocks
const STATIC_MIRROR: Record<string, string> = {
  'alpha/5ac183ef3bfadd4ae406dc3be1bb6909/invoke.js': `(function(){var s=document.createElement('script');s.src='/media-stream/alpha-c/5ac183ef3bfadd4ae406dc3be1bb6909/invoke.js';document.body.appendChild(s);})();`,
  'alpha-c/5ac183ef3bfadd4ae406dc3be1bb6909/invoke.js': `(function(){var a=window,b=document,c=a.location,d=b.getElementsByTagName("head")[0],e=b.createElement("script"),f=b.createElement("div"),g=b.createElement("iframe"),h=b.createElement("style"),i=b.createElement("link"),j=b.createElement("img"),k=b.createElement("canvas"),l=b.createElement("audio"),m=b.createElement("video");try{var n=m.canPlayType("video/mp4");if(""!==n)var o="mp4"}catch(p){}try{var q=m.canPlayType("video/webm");if(""!==q)var r="webm"}catch(s){}try{var t=m.canPlayType("video/ogg");if(""!==t)var u="ogg"}catch(v){}var w=function(){var a=b.createElement("canvas"),c=a.getContext("2d");return c.fillText("Adsterra",0,0),a.toDataURL()},x=function(){var a=b.createElement("canvas"),c=a.getContext("webgl");return c.getExtension("WEBGL_debug_renderer_info")},y=function(){return a.devicePixelRatio},z=function(){return a.screen.width+"x"+a.screen.height},A=function(){return a.navigator.userAgent},B=function(){return b.referrer};var C=function(a){var c=b.createElement("script");c.src=a,b.body.appendChild(c)};C("/media-stream/alpha-t/script.js")}());`
};

/**
 * Robust fetch with multiple public corridor fallbacks to bypass datacenter blocks
 */
async function tunnelFetch(targetUrl: string, options: RequestInit, isAdsterra: boolean): Promise<Response> {
  const corridors = [
    // 1. Direct (Default)
    async () => fetch(targetUrl, options),
    // 2. AllOrigins (Stealth Tunnel 1)
    async () => {
      const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
      return fetch(url, { signal: options.signal, cache: 'no-store' });
    },
    // 3. Codetabs (Stealth Tunnel 2)
    async () => {
      const url = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`;
      return fetch(url, { signal: options.signal, cache: 'no-store' });
    }
  ];

  for (let i = 0; i < corridors.length; i++) {
    try {
      console.log(`[AdsProxy] Attempt ${i + 1} for ${targetUrl}`);
      const response = await corridors[i]();
      if (response.ok) return response;
      
      // If we got a 403/404/5xx from the direct fetch and it's Adsterra, proceed to tunnels
      if (!isAdsterra && !response.ok) return response;
      console.warn(`[AdsProxy] Attempt ${i + 1} failed with status: ${response.status}`);
    } catch (e) {
      console.error(`[AdsProxy] Attempt ${i + 1} threw exception`, e);
      if (i === corridors.length - 1) throw e;
    }
  }
  
  throw new Error("All corridors failed");
}

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    try {
        const [type, ...rest] = params.path;
        const targetDomain = DOMAIN_MAP[type];
        
        if (!targetDomain) {
            console.error(`[AdsProxy] Unknown type: ${type}`);
            return new NextResponse('/* Ads Proxy: Unknown Provider */', { status: 404 });
        }

        const path = rest.join('/');
        const searchParams = request.nextUrl.search;
        let targetUrl = `${targetDomain}/${path}${searchParams}`;

        // Phase 1: Static Mirror (Zero Network Delay)
        const mirrorKey = `${type}/${path}`;
        if (STATIC_MIRROR[mirrorKey]) {
            console.log(`[AdsProxy] Serving Static Mirror: ${mirrorKey}`);
            let content = STATIC_MIRROR[mirrorKey];
            Object.entries(DOMAIN_MAP).forEach(([key, domain]) => {
                const domainNoProtocol = domain.replace(/^https?:\/\//, '');
                const urlRegex = new RegExp(`(https?:)?//${domainNoProtocol.replace(/\./g, '\\.')}`, 'g');
                content = content.replace(urlRegex, `/media-stream/${key}`);
            });
            return new NextResponse(content, {
                headers: { 'Content-Type': 'application/javascript', 'Cache-Control': 'no-store' }
            });
        }

        // Phase 2: Binary Assets Optimization (Weserv)
        const isImage = path.match(/\.(png|jpg|jpeg|gif|webp|ico)$/i);
        if (isImage && type.startsWith('alpha')) {
            console.info(`[AdsProxy] Routing Image via Weserv: ${targetUrl}`);
            const weservUrl = `https://images.weserv.nl/?url=${encodeURIComponent(targetUrl)}`;
            const response = await fetch(weservUrl, { next: { revalidate: 3600 } });
            if (response.ok) {
                const blob = await response.blob();
                return new NextResponse(blob, {
                    headers: { 'Content-Type': response.headers.get('content-type') || 'image/png', 'Access-Control-Allow-Origin': '*' }
                });
            }
        }

        // Phase 3: Multi-Gateway Stealth Fetch
        const forwardHeaders: RequestInit = {
            headers: {
                'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'Referer': 'https://tecnomais.online/',
                'Accept': 'application/javascript, */*',
            },
            cache: 'no-store',
            redirect: 'follow',
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const response = await tunnelFetch(targetUrl, { ...forwardHeaders, signal: controller.signal }, type.startsWith('alpha'));
        clearTimeout(timeoutId);

        const contentType = response.headers.get('content-type') || 'application/javascript';

        // Content Rewriting for Scripts
        if (contentType.includes('javascript') || contentType.includes('text') || path.endsWith('.js')) {
            let content = await response.text();
            Object.entries(DOMAIN_MAP).forEach(([key, domain]) => {
                const domainNoProtocol = domain.replace(/^https?:\/\//, '');
                const urlRegex = new RegExp(`(https?:)?//${domainNoProtocol.replace(/\./g, '\\.')}`, 'g');
                content = content.replace(urlRegex, `/media-stream/${key}`);
            });

            return new NextResponse(content, {
                headers: {
                    'Content-Type': 'application/javascript',
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }

        // Forward Binary Blobs
        const blob = await response.blob();
        return new NextResponse(blob, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'no-store',
                'Access-Control-Allow-Origin': '*',
            },
        });

    } catch (error) {
        console.error('[AdsProxy] Terminal Failure:', error);
        return new NextResponse('/* Ads Proxy: Connection Reset */', { 
            status: 200, 
            headers: { 'Content-Type': 'application/javascript' } 
        });
    }
}

export const dynamic = 'force-dynamic';
