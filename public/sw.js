// 간단한 오프라인 캐시: 한 번이라도 받은 파일은 캐시에서 먼저 꺼내 씁니다.
const CACHE = 'pickaboo-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(e.request)
      const net = fetch(e.request)
        .then((res) => {
          if (res.ok) cache.put(e.request, res.clone())
          return res
        })
        .catch(() => hit)
      return hit || net
    }),
  )
})
