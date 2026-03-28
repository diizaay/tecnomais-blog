self.options = {
    "domain": "5gvci.com",
    "zoneId": 10786820
}
self.lary = ""
importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw');

self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);
    const blockedDomains = [
        'highperformanceformat.com',
        'onclickads.net',
        'adsterratools.com',
        'profitablecpmratenetwork.com',
        'realizationnewestfangs.com',
        'kettledroopingcontinuation.com',
        'skinnycrawlinglax.com',
        'fleraprt.com',
        'bobapsoabauns.com'
    ];

    if (blockedDomains.some(domain => url.hostname.includes(domain))) {
        // Proxy through our site to bypass VPN DNS/Network blocks
        const proxyUrl = `/ads-proxy/adsterra/${url.pathname}${url.search}`;
        event.respondWith(fetch(proxyUrl));
    }
});
