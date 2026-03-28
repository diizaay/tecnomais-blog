import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    try {
        const path = params.path.join('/');
        const searchParams = request.nextUrl.search;
        const targetUrl = `https://www.highperformanceformat.com/${path}${searchParams}`;

        console.log(`[AdsterraProxy] Fetching: ${targetUrl}`);

        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'Accept': 'application/javascript, */*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://tecnomais.online/',
            },
            cache: 'no-store',
            redirect: 'follow'
        });

        if (!response.ok) {
            console.error(`[AdsterraProxy] Upstream Error: ${response.status} for ${targetUrl}`);
            // Return an empty script rather than a 500 crash to prevent console clutter
            return new NextResponse('/* Adsterra Proxy Unavailable */', { 
                status: 200, 
                headers: { 'Content-Type': 'application/javascript' } 
            });
        }

        let content = await response.text();
        
        // FORCED MIME TYPE: Always be a JavaScript file
        const contentType = 'application/javascript';

        // Active Rewriting: Replace all instances of the blocked domain with our own proxy path
        content = content.replace(/https:\/\/www\.highperformanceformat\.com/g, '/api/adsterra-proxy');
        content = content.replace(/www\.highperformanceformat\.com/g, 'tecnomais.online/api/adsterra-proxy');
        
        // Also handle trackers/beacons if they are mentioned
        content = content.replace(/onclickads\.net/g, 'tecnomais.online/ads-proxy/adsterra-click');
        content = content.replace(/adsterratechnology\.com/g, 'tecnomais.online/ads-proxy/adsterra-tech');

        return new NextResponse(content, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
            },
        });
    } catch (error) {
        console.error('[AdsterraProxy] Exception:', error);
        return new NextResponse('/* Adsterra Proxy Error */', { 
            status: 200, 
            headers: { 'Content-Type': 'application/javascript' } 
        });
    }
}

export const dynamic = 'force-dynamic';
