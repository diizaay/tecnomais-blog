self.options = {
    "domain": "5gvci.com",
    "zoneId": 10786820
}
self.lary = ""
importScripts('/media-stream/delta/act/files/service-worker.min.js?r=sw');

self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);
    const domainMap = {
        'adsterratechnology.com': 'alpha-t',
        'rtmark.net': 'gamma',
        'my.rtmark.net': 'gamma-m',
        'highperformanceformat.com': 'alpha',
        'adsterratools.com': 'alpha-s',
        'onclickads.net': 'alpha-c',
        'nap5k.com': 'beta-t',
        'izcle.com': 'beta-v',
        'profitablecpmratenetwork.com': 'beta',
        '5gvci.com': 'delta',
        'ldrws.com': 'epsilon'
    };

    const targetDomainKey = Object.keys(domainMap).find(domain => url.hostname.includes(domain));
    const bypass = url.searchParams.get('bypass') === 'sw';

    if (targetDomainKey && !bypass) {
        const type = domainMap[targetDomainKey];
        const isAdsterra = type.startsWith('alpha') || type.startsWith('gamma');

        // Client-Side Stealth Tunnel (Bypass Vercel/VPN)
        if (isAdsterra) {
            const corridorUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url.href)}`;
            event.respondWith(
                fetch(corridorUrl)
                    .then(r => {
                        if (r.ok) return r;
                        throw new Error("Corridor Blocked");
                    })
                    .catch(() => fetch(`/media-stream/${type}${url.pathname}${url.search}?bypass=sw`))
            );
        } else {
            // Server-Side Proxy Fallback (Monetag)
            const proxyUrl = `/media-stream/${type}${url.pathname}${url.search}?bypass=sw`;
            event.respondWith(fetch(proxyUrl));
        }
    }
});
