self.options = {
    "domain": "5gvci.com",
    "zoneId": 10786820
}
self.lary = ""
importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw');

self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);
    const domainMap = {
        'adsterratechnology.com': '/ads-proxy/adsterra-tech',
        'rtmark.net': '/ads-proxy/adsterra-rtm',
        'my.rtmark.net': '/ads-proxy/adsterra-myrtm',
        'highperformanceformat.com': '/ads-proxy/adsterra',
        'adsterratools.com': '/ads-proxy/adsterra-static',
        'onclickads.net': '/ads-proxy/adsterra-click',
        'nap5k.com': '/ads-proxy/monetag-tag',
        'izcle.com': '/ads-proxy/monetag-vignette',
        'profitablecpmratenetwork.com': '/ads-proxy/monetag'
    };

    const targetDomain = Object.keys(domainMap).find(domain => url.hostname.includes(domain));

    if (targetDomain) {
        // Proxy through our site to bypass VPN DNS/Network blocks
        const proxyPrefix = domainMap[targetDomain];
        const proxyUrl = `${proxyPrefix}${url.pathname}${url.search}`;
        event.respondWith(fetch(proxyUrl));
    }
});
