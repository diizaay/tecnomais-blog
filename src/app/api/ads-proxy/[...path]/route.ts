import { NextRequest, NextResponse } from 'next/server';

const DOMAIN_MAP: Record<string, string> = {
  'adsterra': 'https://www.highperformanceformat.com',
  'monetag': 'https://pl28985299.profitablecpmratenetwork.com',
  'monetag-tag': 'https://nap5k.com',
  'monetag-vignette': 'https://izcle.com',
  'adsterra-click': 'https://onclickads.net',
  'adsterra-tech': 'https://adsterratechnology.com',
  'adsterra-static': 'https://www.adsterratools.com',
  'rtmark': 'https://rtmark.net',
  'myrtmark': 'https://my.rtmark.net',
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

        console.log(`[AdsProxy] Fetching (${type}): ${targetUrl}`);

        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://tecnomais.online/',
                'X-Forwarded-For': request.headers.get('x-forwarded-for') || '',
            },
            cache: 'no-store',
            redirect: 'follow'
        });

        if (!response.ok) {
            console.warn(`[AdsProxy] Upstream Warning: ${response.status} for ${targetUrl}`);
            return new NextResponse('/* Ads Proxy Unavailable */', { 
                status: 200, 
                headers: { 'Content-Type': 'application/javascript' } 
            });
        }

        let content = await response.text();
        const contentType = 'application/javascript';

        // Generic Rewriting: Replace all known ad domains with our proxy path
        Object.entries(DOMAIN_MAP).forEach(([key, domain]) => {
            const domainNoProtocol = domain.replace(/^https?:\/\//, '');
            const protocol = domain.match(/^https?:\/\//)?.[0] || 'https://';
            
            // Rewrite full URLs
            const fullUrlRegex = new RegExp(`${protocol}${domainNoProtocol.replace(/\./g, '\\.')}`, 'g');
            content = content.replace(fullUrlRegex, `/api/ads-proxy/${key}`);
            
            // Rewrite domain-only occurrences (careful with this one)
            const domainRegex = new RegExp(domainNoProtocol.replace(/\./g, '\\.'), 'g');
            content = content.replace(domainRegex, `tecnomais.online/api/ads-proxy/${key}`);
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
