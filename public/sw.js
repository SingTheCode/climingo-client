self.addEventListener("install", () => {
  // 새로 등록되는 서비스 워커를 바로 active 상태로 만들기 위해 호출
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  // 새롭게 등록된 서비스 워커가 현채 페이지를 즉시 제어
  self.clients.claim();
});
