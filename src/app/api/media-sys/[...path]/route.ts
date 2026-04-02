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

        // Check if we have a static mirror for this path to avoid all network blocks
        const mirrorKey = `${type}/${path}`;
        if (STATIC_MIRROR[mirrorKey]) {
            console.log(`[AdsProxy] Serving Static Mirror: ${mirrorKey}`);
            let content = STATIC_MIRROR[mirrorKey];
            
            // Rewrite mirror content too
            Object.entries(DOMAIN_MAP).forEach(([key, domain]) => {
                const domainNoProtocol = domain.replace(/^https?:\/\//, '');
                const urlRegex = new RegExp(`(https?:)?//${domainNoProtocol.replace(/\./g, '\\.')}`, 'g');
                content = content.replace(urlRegex, `/media-stream/${key}`);
            });

            return new NextResponse(content, {
                headers: { 'Content-Type': 'application/javascript', 'Cache-Control': 'no-store' }
            });
        }

        // Simplify headers to the absolute minimum to avoid bot detection
        const forwardHeaders = new Headers();
        forwardHeaders.set('User-Agent', request.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');
        forwardHeaders.set('Referer', 'https://tecnomais.online/');
        forwardHeaders.set('Accept', 'application/javascript, */*');

        console.log(`[AdsProxy] Fetching (${type}): ${targetUrl}`);

        // Abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        let response: Response;
        try {
            response = await fetch(targetUrl, {
                headers: forwardHeaders,
                cache: 'no-store',
                redirect: 'follow',
                signal: controller.signal
            });
        } catch (e) {
            console.warn(`[AdsProxy] Fetch Error: ${targetUrl}`, e);
            // Fallback retry for Adsterra on any network error
            if (type.startsWith('alpha')) {
                const tunnelUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
                response = await fetch(tunnelUrl, { signal: controller.signal });
            } else {
                throw e;
            }
        }

        // If blocked by datacenter filters (403/502) for Adsterra ('alpha'), use Stealth Tunnels
        if (!response.ok && (type.startsWith('alpha'))) {
            const isImage = path.match(/\.(png|jpg|jpeg|gif|webp|ico)$/i);
            
            if (isImage) {
                console.info(`[AdsProxy] Retrying Image via Weserv Corridor: ${targetUrl}`);
                const weservUrl = `https://images.weserv.nl/?url=${encodeURIComponent(targetUrl)}`;
                response = await fetch(weservUrl, { signal: controller.signal });
            } else {
                console.info(`[AdsProxy] Retrying Script via AllOrigins Corridor: ${targetUrl}`);
                const tunnelUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
                response = await fetch(tunnelUrl, {
                    headers: { 'User-Agent': forwardHeaders.get('User-Agent')! },
                    cache: 'no-store',
                    redirect: 'follow',
                    signal: controller.signal
                });
            }
        }
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            console.warn(`[AdsProxy] Upstream Warning: ${response.status} for ${targetUrl}`);
            return new NextResponse('/* Ads Proxy: Upstream Failed */', { 
                status: 502, 
                headers: { 'Content-Type': 'application/javascript' } 
            });
        }

        const contentType = response.headers.get('content-type') || 'application/javascript';

        // Fast path for binary/image assets
        if (contentType.includes('image') || contentType.includes('video') || contentType.includes('font')) {
            const blob = await response.blob();
            return new NextResponse(blob, {
                headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'no-store',
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }

        let content = await response.text();

        // Generic Rewriting: Replace all known ad domains with our proxy path
        Object.entries(DOMAIN_MAP).forEach(([key, domain]) => {
            const domainNoProtocol = domain.replace(/^https?:\/\//, '');
            const urlRegex = new RegExp(`(https?:)?//${domainNoProtocol.replace(/\./g, '\\.')}`, 'g');
            content = content.replace(urlRegex, `/media-stream/${key}`);
        });

        return new NextResponse(content, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
            },
        });
    } catch (error) {
        console.error('[AdsProxy] Exception:', error);
        return new NextResponse('/* Ads Proxy Error */', { 
            status: 200, 
            headers: { 'Content-Type': 'application/javascript' } 
        });
    }
}

export const dynamic = 'force-dynamic';
