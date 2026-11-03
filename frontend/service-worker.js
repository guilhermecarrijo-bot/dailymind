const CACHE_NAME = 'dailymind-shell-v1'
const ARQUIVOS_DE_CACHE = [
  '/',
  '/index.html',
  '/css/estilo.css',
  '/js/app.js',
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
    caches.match(evento.request).then((recurso) => recurso || fetch(evento.request).then((resposta) => {
      if (resposta.ok) {
        const copia = resposta.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(evento.request, copia))
      }
      return resposta
    }).catch(() => caches.match('/index.html')))
  )
})
