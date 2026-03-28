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
                'User-Agent': request.headers.get('user-agent') || '',
                'Accept': request.headers.get('accept') || '*/*',
                'Referer': 'https://www.highperformanceformat.com/', // Mimic the ad network's referer
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            return new NextResponse('Internal Server Error', { status: 500 });
        }

        let content = await response.text();
        const contentType = response.headers.get('content-type') || 'application/javascript';

        // Active Rewriting: Replace all instances of the blocked domain with our own proxy path
        // This ensures that any secondary requests also go through our server
        if (contentType.includes('javascript') || contentType.includes('text')) {
            content = content.replace(/https:\/\/www\.highperformanceformat\.com/g, '/api/adsterra-proxy');
            content = content.replace(/www\.highperformanceformat\.com/g, 'tecnomais.online/api/adsterra-proxy');
            
            // Also handle trackers/beacons if they are mentioned
            content = content.replace(/onclickads\.net/g, 'tecnomais.online/ads-proxy/adsterra-click');
            content = content.replace(/adsterratechnology\.com/g, 'tecnomais.online/ads-proxy/adsterra-tech');
        }

        return new NextResponse(content, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
            },
        });
    } catch (error) {
        console.error('[AdsterraProxy] Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
