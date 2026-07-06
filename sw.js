/* FLAMMERS — Service Worker v5
   HTML: network-first (atualizações instantâneas)
   Assets: cache-first (velocidade + offline) */
const CACHE = "flammers-v5";
const ASSETS = [
  "./", "./index.html", "./vida.html",
  "./css/j.css", "./css/style.css",
  "./js/j-data.js", "./js/j-levels.js", "./js/jornada.js",
  "./js/data.js", "./js/engine.js", "./js/ui.js", "./js/audio.js",
  "./manifest.webmanifest",
  "./assets/icon-192.png", "./assets/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const isHTML = e.request.mode === "navigate" || (e.request.headers.get("accept") || "").includes("text/html");

  if (isHTML) {
    // rede primeiro: sempre a versão mais nova; cache só como fallback offline
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request).then((hit) => hit || caches.match("./")))
    );
    return;
  }

  // assets: cache-first (são versionados via ?v=N)
  e.respondWith(
    caches.match(e.request).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        if (res.ok && new URL(e.request.url).origin === location.origin) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
