const OFFLINE_VERSION = 1;
const CACHE_NAME = 'offline';
const OFFLINE_URL = '/offline.html';

importScripts('/sw/tools.js');

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
        return cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));
    }));
});

self.addEventListener('activate', (event) => {
    const promise = (async () => {
        // Enable navigation preload if it's supported.
        // See https://developers.google.com/web/updates/2017/02/navigation-preload
        if ('navigationPreload' in self.registration) {
            await self.registration.navigationPreload.enable();
        }
    })();
    event.waitUntil(promise);

    // Tell the active service worker to take control of the page immediately.
    self.clients.claim();
});

// normalize the cache key if it is a navigation request
const getCacheKey = request => {
    const [filename, extension] = request.url.split('/').pop().split('?')[0].split('.');
    // console.log(filename,extension)
    if (extension) { return filename + '.' + extension; }
    if (request.mode === 'navigate') {
        const url = new URL(request.url);
        url.search = '';
        return url;
    }
    return request;
}

// fetch the resource from the network
const fromNetwork = (request, timeout) =>
    new Promise((fulfill, reject) => {
        const timeoutId = setTimeout(reject, timeout);
        fetch(request).then(response => {
            clearTimeout(timeoutId);
            fulfill(response);
            update(request);
        }, reject);
    });

// fetch the resource from the browser cache
const fromCache = request => caches.open(CACHE_NAME)
    .then(cache => cache.match(getCacheKey(request)).then(matching => matching || cache.match(OFFLINE_URL)));

// cache the current page to make it available for offline
const update = request =>
    caches
        .open(CACHE_NAME)
        .then(cache =>
            fetch(request).then(response => cache.put(getCacheKey(request), response))
        );

self.addEventListener('fetch', (evt) => {
    if (evt.request.cache === 'only-if-cached' && evt.request.mode !== 'same-origin') return;
    evt.respondWith(fromNetwork(evt.request, 10000).catch(() => fromCache(evt.request)));
    evt.waitUntil(update(evt.request));
});