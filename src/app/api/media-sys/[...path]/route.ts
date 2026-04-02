import { NextRequest, NextResponse } from 'next/server';

const DOMAIN_MAP: Record<string, string> = {
  'alpha': 'https://www.highperformanceformat.com',
  'beta': 'https://pl28985299.profitablecpmratenetwork.com',
  'beta-t': 'https://nap5k.com',
  'beta-v': 'https://izcle.com',
  'alpha-c': 'https://onclickads.net',
  'alpha-t': 'https://adsterratechnology.com',
  'alpha-s': 'https://www.adsterratools.com',
  'gamma': 'https://rtmark.net',
  'gamma-m': 'https://my.rtmark.net',
  'delta': 'https://5gvci.com',
  'epsilon': 'https://ldrws.com',
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
        const targetUrl = `${targetDomain}/${path}${searchParams}`;

        // Simplify headers to the absolute minimum to avoid bot detection
        const forwardHeaders = new Headers();
        forwardHeaders.set('User-Agent', request.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');
        forwardHeaders.set('Referer', 'https://tecnomais.online/');
        forwardHeaders.set('Accept', 'application/javascript, */*');

        console.log(`[AdsProxy] Fetching (${type}): ${targetUrl}`);

        // Abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(targetUrl, {
            headers: forwardHeaders,
            cache: 'no-store',
            redirect: 'follow',
            signal: controller.signal
        });
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
