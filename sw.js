// Global Business Manager — Service Worker
var CACHE_NAME = 'gbm-cache-v1';
var URLS_A_METTRE_EN_CACHE = [
  './index.html',
  './manifest.json',
  './icon-72.png',
  './icon-96.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(URLS_A_METTRE_EN_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(noms) {
      return Promise.all(
        noms.filter(function(nom) { return nom !== CACHE_NAME; })
            .map(function(nom) { return caches.delete(nom); })
      );
    })
  );
  self.clients.claim();
});

// Stratégie : essayer le réseau d'abord (pour les données à jour), sinon le cache (mode hors-ligne)
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
