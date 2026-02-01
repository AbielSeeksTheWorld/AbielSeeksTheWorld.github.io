const CACHE = "abiel-v2";

const ASSETS = [
  "./",
  "./index.html",
  "./archive.html",
  "./style.css",
  "./manifest.webmanifest",

  // Posts
  "./posts/001.html",
  "./posts/002.html",
  "./posts/003.html",
  "./posts/004.html",

  // App icons (recommended for offline / install polish)
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-512-maskable.png",

  // Homepage images (optional but recommended)
  "./assets/HP1.png",
  "./assets/HP2.png",
  "./assets/HP3.png",
  "./assets/HP4.png",
  "./assets/HP2.1.png",
  "./assets/HP2.2.png"
];

// Install: cache core assets for offline
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

// Activate: clean old caches + take control immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

// Fetch: cache-first for same-origin GET requests
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    (async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;

      try {
        const response = await fetch(event.request);
        return response;
      } catch (err) {
        // Optional: if you want a nicer offline fallback later,
        // you can return caches.match("./index.html") for navigation requests.
        throw err;
      }
    })()
  );
});

