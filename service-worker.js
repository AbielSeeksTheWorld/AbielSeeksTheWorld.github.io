const CACHE = "abiel-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./archive.html",
  "./style.css",
  "./manifest.webmanifest",
  "./posts/001.html",
  "./posts/002.html",
  "./posts/003.html",
  "./posts/004.html"
];

// Install: cache core pages for offline
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE ? null : caches.delete(k))))
    )
  );
});

// Fetch: cache-first for same-origin requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
