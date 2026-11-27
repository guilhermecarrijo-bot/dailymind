const CACHE_NAME = 'dailymind-shell-v9-tailwind'
const ARQUIVOS_DE_CACHE = [
  '/',
  '/index.html',
  '/css/estilo.css',
  '/css/tailwind.css',
  '/js/app.js?v=20261127-i18n2',
  '/js/pwa-offline.js?v=20261127-i18n2',
  '/manifest.webmanifest',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
]

self.addEventListener('install', (evento) => {
  evento.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ARQUIVOS_DE_CACHE)))
  self.skipWaiting()
})

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((nomes) => Promise.all(
      nomes.filter((nome) => nome !== CACHE_NAME).map((nome) => caches.delete(nome))
    ))
  )
  self.clients.claim()
})

self.addEventListener('fetch', (evento) => {
  if (evento.request.method !== 'GET' || evento.request.url.includes('/api/')) return

  evento.respondWith(
    fetch(evento.request).then((resposta) => {
      if (resposta.ok || resposta.type === 'opaque') {
        const copia = resposta.clone()
        caches.open(CACHE_NAME)
          .then((cache) => cache.put(evento.request, copia))
          .catch(() => {})
      }
      return resposta
    }).catch(async () => {
      const recurso = await caches.match(evento.request)
      if (recurso) return recurso
      if (evento.request.mode === 'navigate') return caches.match('/index.html')
      return Response.error()
    })
  )
})
