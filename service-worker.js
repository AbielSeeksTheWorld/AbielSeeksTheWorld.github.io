const CACHE = "abiel-v3";

const ASSETS = [
  "./",
  "./index.html",
  "./archive.html",
  "./install.html",
  "./style.css",
  "./manifest.webmanifest",

  // Posts
  "./posts/001.html",
  "./posts/002.html",
  "./posts/003.html",
  "./posts/004.html",

  // App icons
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-512-maskable.png",

  // Homepage images
  "./assets/HP1.png",
  "./assets/HP2.png",
  "./assets/HP3.png",
  "./assets/HP4.png",
  "./assets/HP2.1.png",
  "./assets/HP2.2.png"
];

// Install: cache core assets for offline use
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
});

// Activate: remove old caches and take control
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// Fetch handling
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      // Page navigations: try network first, fall back to cache
      if (event.request.mode === "navigate") {
        try {
          return await fetch(event.request);
        } catch {
          return (await caches.match("./index.html")) || Response.error();
        }
      }

      // Other requests: cache-first
      const cached = await caches.match(event.request);
      if (cached) return cached;

      return await fetch(event.request);
    })()
  );
});

