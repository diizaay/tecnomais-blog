self.options = {
    "domain": "5gvci.com",
    "zoneId": 10786820
}
self.lary = ""
importScripts('/media-stream/delta/act/files/service-worker.min.js?r=sw');

self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);

    // Skip bypass-flagged requests (avoid loops)
    if (url.searchParams.get('bypass') === 'sw') return;

    // Known ad network domains
    const domainMap = {
        'adsterratechnology.com': 'alpha-t',
        'rtmark.net': 'gamma',
        'my.rtmark.net': 'gamma-m',
        'highperformanceformat.com': 'alpha',
        'www.highperformanceformat.com': 'alpha',
        'adsterratools.com': 'alpha-s',
        'onclickads.net': 'alpha-c',
        'highcpmgate.com': 'alpha-g',
        'highrateadvertisement.com': 'alpha-r',
        'nap5k.com': 'beta-t',
        'izcle.com': 'beta-v',
        'profitablecpmratenetwork.com': 'beta',
        '5gvci.com': 'delta',
        'ldrws.com': 'epsilon'
    };

    const targetDomainKey = Object.keys(domainMap).find(function(domain) {
        return url.hostname === domain || url.hostname.endsWith('.' + domain);
    });

    if (!targetDomainKey) return;

    var type = domainMap[targetDomainKey];

    // 3-stage fallback chain:
    // 1. Direct (works without VPN)
    // 2. Server proxy (works for non-blocked domains)  
    // 3. AllOrigins from browser (last resort, bypasses both VPN and datacenter blocks)
    event.respondWith(
        fetch(event.request).catch(function() {
            // Stage 2: Server proxy
            var proxyUrl = '/media-stream/' + type + url.pathname + url.search;
            return fetch(proxyUrl).then(function(r) {
                if (r.ok) return r;
                throw new Error('proxy-failed');
            }).catch(function() {
                // Stage 3: AllOrigins CORS tunnel (browser → AllOrigins → ad network)
                var tunnelUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url.href);
                return fetch(tunnelUrl);
            });
        })
    );
});
