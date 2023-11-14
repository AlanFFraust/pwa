const CACHE_NAME = 'conversor-currency-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icon.png',
    './styles.css',
    './app.js'
];
const API_URL = 'https://v6.exchangerate-api.com/v6/47a2c19322df51ee86d4d0c4/latest/';
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
        let data;

        try {
            const response = await fetch(`${API_URL}${fromCurrency}`);
            data = await response.json();

            // Almacena en caché la respuesta en la caché dinámica para su uso futuro
            const dynamicCache = await caches.open(DYNAMIC_CACHE_NAME);
            dynamicCache.put(`${API_URL}${fromCurrency}`, new Response(JSON.stringify(data)));
        } catch (networkError) {
            // Si falla la red, intenta obtener los datos de la caché dinámica
            const cachedResponse = await caches.match(`${API_URL}${fromCurrency}`);
            if (cachedResponse) {
                data = await cachedResponse.json();
            } else {
                throw networkError;
            }
        }

        if (data.result === 'error') {
            console.error('Error en la respuesta de la API:', data.error);
            return;
        }

        console.log(data.conversion_rates);

        // Llama a la función para realizar la conversión
        const result = realizarConversion(amount, data.conversion_rates, toCurrency);

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

