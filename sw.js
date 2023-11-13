const CACHE_NAME = 'conversor-currency-v1';
const urlsToCache = [
    '/',
    './index.html',
    './manifest.json',
    './icon.png',
    './styles.css'
];

const NOMBRE_CACHE_DINAMICA = `memoria-cache-dinamica-v1`;
recursos_Dinamicos = [];


// Utilice el evento de instalación para almacenar en caché previamente todos los recursos iniciales.
self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache1 = await caches.open(CACHE_NAME);
        cache1.addAll(recursos_Staticos);

        const cache2 = await caches.open(NOMBRE_CACHE_DINAMICA);
        cache2.addAll(recursos_Dinamicos);
    })());
});



self.addEventListener('fetch', event => {
    event.respondWith((async () => {

        const cache1 = await caches.open(NOMBRE_CACHE_STATICA);  //Abre cache Estatica
        const cache2 = await caches.open(NOMBRE_CACHE_DINAMICA);  //Abre cache Dinamico


        const respuesta = await cache1.match(event.request);     //Busca el recurso
        if (respuesta) {
            console.log("Cache Estatica: " + event.request.url);
            return respuesta;
        }
        else {
            try {
                const respuestaRed = await fetch(event.request);
                cache2.put(event.request, respuestaRed.clone());
                console.log("Red: " + event.request.url + " Actualizo cache Dinamica");
                return respuestaRed;
            }
            catch (e) { //Si falló la red
                const respuesta2 = await cache2.match(event.request);
                console.log("Dinamica: " + event.request.url);
                return respuesta2
            }
        }
    })());
});
