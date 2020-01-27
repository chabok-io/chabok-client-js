importScripts('./ChabokSDKWorker.js')

const dataCacheName = 'chabok-data'
const cacheName = 'chabok-cache'
const filesToCache = [
  'images/android-chrome-192x192.png',
  'images/android-chrome-512x512.png',
  'images/badge.png',
  'images/icon.png'
]

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install')
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell')
      return cache.addAll(filesToCache)
    })
  )
})

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate')
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // eslint-disable-next-line consistent-return
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key)
          return caches.delete(key)
        }
      }))
    })
  )
  return self.clients.claim()
})

self.addEventListener('fetch', function (event) {
  console.log('Fetch event for ', event.request.url)
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        console.log('Found ', event.request.url, ' in cache')
        return response
      }
      console.log('Network request for ', event.request.url)
      return fetch(event.request)

      // eslint-disable-next-line handle-callback-err
    }).catch(function (error) {

      // TODO 6

    })
  )
})
