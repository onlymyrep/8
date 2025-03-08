const CACHE_NAME = '8marta-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Установка Service Worker и кэширование ресурсов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .catch((error) => {
        console.error('Ошибка при кэшировании ресурсов:', error);
      })
  );
});

// Активация Service Worker и очистка старых кэшей
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Возвращаем закэшированный ресурс, если он есть
        if (response) {
          return response;
        }

        // Иначе загружаем ресурс из сети
        return fetch(event.request)
          .then((networkResponse) => {
            // Кэшируем новый ресурс
            return caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
          })
          .catch(() => {
            // Обработка ошибок (например, возврат fallback-страницы)
            return caches.match('/offline.html'); // Замените на ваш fallback
          });
      })
  );
});
