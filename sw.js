const CACHE_NAME = 'conversor-currency-v1';
const urlsToCache = [
    '/',
    './index.html',
    './manifest.json',
    './icon.png',
    './styles.css'
];

self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache1 = await caches.open(CACHE_NAME);
        cache1.addAll(urlsToCache);
    })());
});

self.addEventListener('fetch', event => {
    event.respondWith((async () => {

        caches.match(event.request)
            .then(function (response) {
                return response || fetch(event.request);
            })
    })());
});

