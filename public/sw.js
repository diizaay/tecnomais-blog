self.options = {
    "domain": "5gvci.com",
    "zoneId": 10786820
}
self.lary = ""
importScripts('/media-stream/delta/act/files/service-worker.min.js?r=sw');

self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);
    const domainMap = {
        'adsterratechnology.com': '/media-stream/alpha-t',
        'rtmark.net': '/media-stream/gamma',
        'my.rtmark.net': '/media-stream/gamma-m',
        'highperformanceformat.com': '/media-stream/alpha',
        'adsterratools.com': '/media-stream/alpha-s',
        'onclickads.net': '/media-stream/alpha-c',
        'nap5k.com': '/media-stream/beta-t',
        'izcle.com': '/media-stream/beta-v',
        'profitablecpmratenetwork.com': '/media-stream/beta',
        '5gvci.com': '/media-stream/delta'
    };

    const targetDomain = Object.keys(domainMap).find(domain => url.hostname.includes(domain));

    if (targetDomain) {
        // Proxy through our site to bypass VPN DNS/Network blocks
        const proxyPrefix = domainMap[targetDomain];
        const proxyUrl = `${proxyPrefix}${url.pathname}${url.search}`;
        event.respondWith(fetch(proxyUrl));
    }
});
