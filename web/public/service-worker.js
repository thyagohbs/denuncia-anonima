const CACHE_NAME = 'denuncia-anonima-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.svg',
  // Adicione outros arquivos estáticos importantes
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Estratégia de cache: Network first, falling back to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a resposta for bem-sucedida, clone-a e armazene-a em cache
        if (event.request.method === 'GET' && response.status === 200) {
          let responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // Se a rede falhar, tente do cache
        return caches.match(event.request);
      })
  );
});

// Atualização do Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});