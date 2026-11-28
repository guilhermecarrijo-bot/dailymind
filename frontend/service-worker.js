const CACHE_NAME = 'dailymind-shell-v12-icones'
const ARQUIVOS_DE_CACHE = [
  '/',
  '/index.html',
  '/css/estilo.css?v=20261128-icones',
  '/css/tailwind.css?v=20261128-icones',
  '/js/app.js?v=20261128-icones',
  '/js/pwa-offline.js?v=20261128-icones',
  '/js/interface.js?v=20261128-icones',
  '/js/icones.js?v=20261128-icones',
  '/fonts/nunito-latin.woff2',
  '/img/logo-dailymind.png',
  '/img/mimo/mimo.svg',
  '/img/mimo/mimo-piscando.svg',
  '/img/mimo/mimo-feliz.svg',
  '/img/mimo/mimo-triste.svg',
  '/img/mimo/mimo-ansioso.svg',
  '/img/mimo/mimo-cansado.svg',
  '/img/mimo/mimo-irritado.svg',
  '/img/mimo/mimo-neutro.svg',
  '/img/icones/acessibilidade.svg',
  '/img/icones/alfinete.svg',
  '/img/icones/alongar.svg',
  '/img/icones/balao.svg',
  '/img/icones/broto.svg',
  '/img/icones/bule.svg',
  '/img/icones/bussola.svg',
  '/img/icones/caderno.svg',
  '/img/icones/caixa.svg',
  '/img/icones/camera.svg',
  '/img/icones/caneta.svg',
  '/img/icones/check.svg',
  '/img/icones/chuveiro.svg',
  '/img/icones/despertador.svg',
  '/img/icones/dormir.svg',
  '/img/icones/engrenagem.svg',
  '/img/icones/escada.svg',
  '/img/icones/estrela.svg',
  '/img/icones/fones.svg',
  '/img/icones/globo.svg',
  '/img/icones/gota.svg',
  '/img/icones/grafico.svg',
  '/img/icones/humor-ansioso.svg',
  '/img/icones/humor-cansado.svg',
  '/img/icones/humor-feliz.svg',
  '/img/icones/humor-irritado.svg',
  '/img/icones/humor-neutro.svg',
  '/img/icones/humor-triste.svg',
  '/img/icones/janela.svg',
  '/img/icones/lampada.svg',
  '/img/icones/livros.svg',
  '/img/icones/lua.svg',
  '/img/icones/maca.svg',
  '/img/icones/meditacao.svg',
  '/img/icones/nota-musical.svg',
  '/img/icones/olhos.svg',
  '/img/icones/paleta.svg',
  '/img/icones/pegadas.svg',
  '/img/icones/perfil.svg',
  '/img/icones/pilula.svg',
  '/img/icones/porta.svg',
  '/img/icones/prancheta.svg',
  '/img/icones/raio.svg',
  '/img/icones/relogio.svg',
  '/img/icones/rosto-feliz.svg',
  '/img/icones/sofa.svg',
  '/img/icones/sol.svg',
  '/img/icones/telefone.svg',
  '/img/icones/tenis.svg',
  '/img/icones/ursinho.svg',
  '/img/icones/vento.svg',
  '/img/icones/xicara.svg',
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
