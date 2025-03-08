const CACHE_NAME = '8marta-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/offline.html' // Добавьте fallback-страницу
];

// Установка Service Worker и кэширование ресурсов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting()) // Активируем Service Worker сразу после установки
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
            return caches.delete(cacheName); // Удаляем старые кэши
          }
        })
      );
    }).then(() => self.clients.claim()) // Активируем Service Worker для всех клиентов
  );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Игнорируем запросы, которые не являются HTTP/HTTPS
  if (!request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Возвращаем закэшированный ресурс, если он есть
      if (cachedResponse) {
        return cachedResponse;
      }

      // Иначе загружаем ресурс из сети
      return fetch(request).then((networkResponse) => {
        // Клонируем ответ, чтобы использовать его для кэширования
        const responseToCache = networkResponse.clone();

        // Кэшируем новый ресурс
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Возвращаем fallback-страницу, если сеть недоступна
        return caches.match('/offline.html');
      });
    })
  );
});
