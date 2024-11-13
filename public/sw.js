self.addEventListener("install", () => {
  // console.log("service worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  // console.log("service worker activated");
  self.clients.claim();
});
