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

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    try {
        const [type, ...rest] = params.path;
        const targetDomain = DOMAIN_MAP[type];
        
        if (!targetDomain) {
            return new NextResponse('/* Unknown */', { status: 404 });
        }

        const path = rest.join('/');
        const searchParams = request.nextUrl.search;
        const targetUrl = `${targetDomain}/${path}${searchParams}`;

        const forwardHeaders = new Headers();
        forwardHeaders.set('User-Agent', request.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');
        forwardHeaders.set('Referer', 'https://tecnomais.online/');
        forwardHeaders.set('Accept', '*/*');

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
            // Return 502 so the client-side onerror fallback triggers
            return new NextResponse('/* upstream error */', { 
                status: 502, 
                headers: { 'Content-Type': 'application/javascript' } 
            });
        }

        const contentType = response.headers.get('content-type') || 'application/javascript';

        // Binary assets (images, fonts, etc.) — pass through as-is
        if (contentType.includes('image') || contentType.includes('video') || contentType.includes('font') || contentType.includes('octet-stream')) {
            const blob = await response.blob();
            return new NextResponse(blob, {
                headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'no-store',
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }

        // Text/Script assets — rewrite ad domains to our proxy paths
        let content = await response.text();
        Object.entries(DOMAIN_MAP).forEach(([key, domain]) => {
            const domainNoProtocol = domain.replace(/^https?:\/\//, '');
            const urlRegex = new RegExp(`(https?:)?//${domainNoProtocol.replace(/\./g, '\\.')}`, 'g');
            content = content.replace(urlRegex, `/media-stream/${key}`);
        });

        return new NextResponse(content, {
            headers: {
                'Content-Type': contentType.includes('javascript') ? 'application/javascript' : contentType,
                'Cache-Control': 'no-store',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('[AdsProxy] Error:', error);
        // Return 200 with empty JS so the page doesn't break
        return new NextResponse('/* proxy timeout */', { 
            status: 200, 
            headers: { 'Content-Type': 'application/javascript' } 
        });
    }
}

export const dynamic = 'force-dynamic';
