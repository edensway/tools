self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("Service Worker active");
});