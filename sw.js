const CACHE_NAME = 'conversor-currency-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icon.png',
    './styles.css',
    './app.js'
];
const API_URL = 'https://open.er-api.com/v6/latest/USD';
const DYNAMIC_CACHE_NAME = 'memoria-cache-dinamica-v1';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then(networkResponse => {
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        const clonedResponse = networkResponse.clone();

                        caches.open(DYNAMIC_CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, clonedResponse);
                            });

                        return networkResponse;
                    })
                    .catch(error => {
                        return caches.match(event.request);
                    });
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cache => cache !== CACHE_NAME && cache !== DYNAMIC_CACHE_NAME)
                    .map(cache => caches.delete(cache))
            );
        })
    );
});

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'convert') {
        convertirMoneda(event.data.amount, event.data.fromCurrency, event.data.toCurrency);
    }
});

async function convertirMoneda(amount, fromCurrency, toCurrency) {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log(response);
        if (data.error) {
            console.error('Error en la respuesta de la API:', data.error);
            return;
        }

        const rate = data.rates[toCurrency];
        const result = amount * rate;

        // Enviar el resultado al cliente
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'conversionResult',
                    result: result.toFixed(2)
                });
            });
        });
    } catch (error) {
        console.error('Error al realizar la conversión:', error);
    }
}

