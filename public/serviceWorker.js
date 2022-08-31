const CACHE_NAME = 'version-1'
const urlsToCache = ['index.html', 'offline.html']

const self = this

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches
      .match(evt.request)
      .then(() => fetch(evt.request).catch(() => caches.match('offline.html')))
  )
})

self.addEventListener('activate', (evt) => {
  const cacheWhiteList = []
  cacheWhiteList.push(CACHE_NAME)
  evt.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((item) => {
          if (!cacheWhiteList.includes(item)) {
            return caches.delete(item)
          }
          return item
        })
      )
    )
  )
})
