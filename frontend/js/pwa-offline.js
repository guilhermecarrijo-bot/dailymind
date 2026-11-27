const CHAVE_FILA_LOCAL = 'dailymind_fila_offline'
const NOME_BANCO = 'dailymind-pwa'
const NOME_LOJA = 'filaOffline'
const RECURSOS_SINCRONIZAVEIS = [
  '/api/humor',
  '/api/sono',
  '/api/energia',
  '/api/lembretes',
  '/api/usuarios/perfil'
]
const METODOS_SINCRONIZAVEIS = ['POST', 'PUT', 'PATCH', 'DELETE']
const IDIOMAS_DISPONIVEIS = ['pt-BR', 'en', 'es']
const MENSAGENS_OFFLINE = {
  'pt-BR': 'Registro salvo neste dispositivo. Enviaremos quando houver conexão.',
  en: 'Saved on this device. We will send it when you are back online.',
  es: 'Guardado en este dispositivo. Lo enviaremos cuando haya conexión.'
}

const fetchOriginal = window.fetch.bind(window)
let sincronizando = false

function caminhoDaApi(endereco) {
  try {
    const url = new URL(typeof endereco === 'string' ? endereco : endereco.url, window.location.href)
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) return url.pathname
  } catch (_) {}
  return null
}

function deveSincronizar(caminho, metodo) {
  return METODOS_SINCRONIZAVEIS.includes(metodo)
    && RECURSOS_SINCRONIZAVEIS.some((recurso) => caminho === recurso || caminho.startsWith(`${recurso}/`))
}

function abrirBanco() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB indisponível'))
      return
    }
    const pedido = window.indexedDB.open(NOME_BANCO, 1)
    pedido.onupgradeneeded = () => {
      const banco = pedido.result
      if (!banco.objectStoreNames.contains(NOME_LOJA)) {
        banco.createObjectStore(NOME_LOJA, { keyPath: 'id', autoIncrement: true })
      }
    }
    pedido.onsuccess = () => resolve(pedido.result)
    pedido.onerror = () => reject(pedido.error)
  })
}

function operarLoja(modo, acao) {
  return abrirBanco().then((banco) => new Promise((resolve, reject) => {
    const transacao = banco.transaction(NOME_LOJA, modo)
    const loja = transacao.objectStore(NOME_LOJA)
    let resultado
    const pedido = acao(loja)
    if (pedido) pedido.onsuccess = () => { resultado = pedido.result }
    transacao.oncomplete = () => {
      banco.close()
      resolve(resultado)
    }
    transacao.onerror = () => {
      banco.close()
      reject(transacao.error)
    }
    transacao.onabort = () => {
      banco.close()
      reject(transacao.error)
    }
  }))
}

function lerFilaLocal() {
  try {
    const itens = JSON.parse(window.localStorage.getItem(CHAVE_FILA_LOCAL) || '[]')
    return Array.isArray(itens) ? itens : []
  } catch (_) {
    return []
  }
}

function salvarFilaLocal(itens) {
  try {
    window.localStorage.setItem(CHAVE_FILA_LOCAL, JSON.stringify(itens))
  } catch (_) {}
}

async function listarFila() {
  try {
    const itens = await operarLoja('readonly', (loja) => loja.getAll())
    return Array.isArray(itens) ? itens : []
  } catch (_) {
    return lerFilaLocal()
  }
}

async function adicionarFila(item) {
  const registro = { ...item, criadoEm: Date.now() }
  try {
    await operarLoja('readwrite', (loja) => loja.add(registro))
  } catch (_) {
    const itens = lerFilaLocal()
    itens.push({ ...registro, id: `${Date.now()}-${Math.random()}` })
    salvarFilaLocal(itens)
  }
}

async function removerFila(id) {
  try {
    await operarLoja('readwrite', (loja) => loja.delete(id))
  } catch (_) {
    salvarFilaLocal(lerFilaLocal().filter((item) => String(item.id) !== String(id)))
  }
}

function idiomaOffline() {
  try {
    const salvo = JSON.parse(window.localStorage.getItem('dailymind_configuracoes') || '{}')
    return IDIOMAS_DISPONIVEIS.includes(salvo.idioma) ? salvo.idioma : 'pt-BR'
  } catch (_) {
    return 'pt-BR'
  }
}

function respostaPendente() {
  const corpo = JSON.stringify({
    sucesso: true,
    pendente: true,
    mensagem: MENSAGENS_OFFLINE[idiomaOffline()]
  })
  return new Response(corpo, {
    status: 202,
    headers: { 'Content-Type': 'application/json' }
  })
}

function notificarAplicativo() {
  const painel = document.getElementById('tela-dashboard')
  if (painel && !painel.classList.contains('hidden') && typeof window.carregarDados === 'function') {
    window.carregarDados()
  }
  const graficos = document.getElementById('tela-graficos')
  if (graficos && !graficos.classList.contains('hidden') && typeof window.carregarGraficos === 'function') {
    window.carregarGraficos()
  }
  window.dispatchEvent(new Event('dailymind:sincronizado'))
}

async function sincronizarFila() {
  if (sincronizando || !window.navigator.onLine) return
  const itens = await listarFila()
  if (!itens.length) return

  sincronizando = true
  let enviados = 0
  try {
    for (const item of itens) {
      try {
        const opcoes = {
          method: item.method,
          headers: item.headers,
          credentials: 'include'
        }
        if (item.body) opcoes.body = item.body
        const resposta = await fetchOriginal(item.url, opcoes)
        if (resposta.ok) {
          await removerFila(item.id)
          enviados += 1
        } else if (resposta.status === 401 || resposta.status === 429 || resposta.status >= 500) {
          break
        } else {
          await removerFila(item.id)
          enviados += 1
        }
      } catch (_) {
        break
      }
    }
  } finally {
    sincronizando = false
  }
  if (enviados) notificarAplicativo()
}

window.fetch = async function (entrada, opcoes) {
  let requisicao
  try {
    requisicao = new Request(entrada, opcoes)
  } catch (_) {
    return fetchOriginal(entrada, opcoes)
  }

  const caminho = caminhoDaApi(requisicao.url)
  const metodo = requisicao.method.toUpperCase()
  if (!caminho || !deveSincronizar(caminho, metodo)) return fetchOriginal(requisicao)

  const copia = requisicao.clone()
  let corpo = ''
  try {
    corpo = await copia.text()
  } catch (_) {}
  const cabecalhos = {}
  const tipoConteudo = copia.headers.get('Content-Type')
  if (tipoConteudo) cabecalhos['Content-Type'] = tipoConteudo

  try {
    return await fetchOriginal(requisicao)
  } catch (erro) {
    await adicionarFila({
      url: requisicao.url,
      method: metodo,
      headers: cabecalhos,
      body: corpo
    })
    return respostaPendente()
  }
}

window.addEventListener('online', sincronizarFila)
window.addEventListener('focus', sincronizarFila)
window.addEventListener('load', () => window.setTimeout(sincronizarFila, 500))
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) sincronizarFila()
})
window.setInterval(sincronizarFila, 60000)
