// URL base da API
const URL_API = '/api'

// Estado do aplicativo
let usuarioAtual = null
let iconeSelecionado = '📌'

// ==================== UTILITÁRIOS ====================

function exibirToast(mensagem, tipo = 'sucesso') {
  const toast = document.getElementById('toast')
  toast.textContent = mensagem
  toast.className = `fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 z-50 ${tipo === 'sucesso' ? 'bg-mint-500' : 'bg-red-500'}`
  toast.classList.remove('hidden')
  setTimeout(() => toast.classList.add('hidden'), 3000)
}

async function api(metodo, endpoint, dados = null) {
  const opcoes = {
    method: metodo,
    headers: { 'Content-Type': 'application/json' }
  }
  if (dados) opcoes.body = JSON.stringify(dados)
  const resposta = await fetch(`${URL_API}${endpoint}`, opcoes)
  return resposta.json()
}

// ==================== AUTENTICAÇÃO ====================

function mostrarLogin() {
  document.getElementById('form-login').classList.remove('hidden')
  document.getElementById('form-cadastro').classList.add('hidden')
}

function mostrarCadastro() {
  document.getElementById('form-login').classList.add('hidden')
  document.getElementById('form-cadastro').classList.remove('hidden')
}

// Login
document.getElementById('form-login').querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = document.getElementById('login-email').value.trim()
  const senha = document.getElementById('login-senha').value

  const resultado = await api('POST', '/usuarios/login', { email, senha })

  if (resultado.sucesso) {
    usuarioAtual = resultado.usuario
    localStorage.setItem('dailymind_usuario', JSON.stringify(usuarioAtual))
    exibirToast(`Bem-vindo, ${usuarioAtual.nome}! 🧠`)
    entrarApp()
  } else {
    exibirToast(resultado.mensagem, 'erro')
  }
})

// Cadastro
document.getElementById('form-cadastro').querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const nome = document.getElementById('cadastro-nome').value.trim()
  const email = document.getElementById('cadastro-email').value.trim()
  const senha = document.getElementById('cadastro-senha').value
  const idade = document.getElementById('cadastro-idade').value
  const ocupacao = document.getElementById('cadastro-ocupacao').value.trim()

  const dados = { nome, email, senha }
  if (idade) dados.idade = parseInt(idade)
  if (ocupacao) dados.ocupacao = ocupacao

  const resultado = await api('POST', '/usuarios/cadastro', dados)

  if (resultado.sucesso) {
    usuarioAtual = resultado.usuario
    localStorage.setItem('dailymind_usuario', JSON.stringify(usuarioAtual))
    exibirToast('Conta criada com sucesso! 🎉')
    entrarApp()
  } else {
    exibirToast(resultado.mensagem, 'erro')
  }
})

function fazerLogout() {
  usuarioAtual = null
  localStorage.removeItem('dailymind_usuario')
  document.getElementById('tela-dashboard').classList.add('hidden')
  document.getElementById('tela-auth').classList.remove('hidden')
  mostrarLogin()
}

function entrarApp() {
  document.getElementById('tela-auth').classList.add('hidden')
  document.getElementById('tela-dashboard').classList.remove('hidden')
  document.getElementById('nome-usuario').textContent = usuarioAtual.nome
  document.getElementById('inicial-usuario').textContent = usuarioAtual.nome.charAt(0).toUpperCase()
  carregarDados()
}

// ==================== NAVEGAÇÃO ====================

function mostrarTela(tela) {
  document.getElementById('tela-dashboard').classList.add('hidden')
  document.getElementById('tela-graficos').classList.add('hidden')
  document.getElementById('tela-lembretes').classList.add('hidden')
  document.getElementById('tela-perfil').classList.add('hidden')
  document.getElementById(`tela-${tela}`).classList.remove('hidden')

  if (tela === 'graficos') carregarGraficos()
  if (tela === 'lembretes') carregarTodosLembretes()
  if (tela === 'perfil') carregarPerfil()
}

function mostrarPerfil() {
  mostrarTela('perfil')
}

// ==================== MODAIS ====================

function abrirModalHumor() {
  document.getElementById('modal-humor').classList.remove('hidden')
}

function abrirModalSono() {
  document.getElementById('modal-sono').classList.remove('hidden')
}

function abrirModalEnergia() {
  document.getElementById('modal-energia').classList.remove('hidden')
}

function abrirModalLembrete() {
  document.getElementById('modal-lembrete').classList.remove('hidden')
}

function fecharModal(id) {
  document.getElementById(id).classList.add('hidden')
}

// ==================== HUMOR ====================

async function registrarHumor(emoji) {
  const resultado = await api('POST', '/humor', { usuario_id: usuarioAtual.id, emoji })
  if (resultado.sucesso) {
    exibirToast('Humor registrado! 😊')
    fecharModal('modal-humor')
    document.getElementById('humor-atual').textContent = emoji
    const textos = { '😊': 'Feliz', '😔': 'Triste', '😰': 'Ansioso', '😫': 'Cansado', '😤': 'Irritado' }
    document.getElementById('humor-texto').textContent = textos[emoji] || 'Registrado'
    carregarSugestoes()
  }
}

// ==================== SONO ====================

document.getElementById('input-sono').addEventListener('input', (e) => {
  document.getElementById('sono-valor').textContent = e.target.value
})

async function registrarSono() {
  const horas = parseFloat(document.getElementById('input-sono').value)
  const resultado = await api('POST', '/sono', { usuario_id: usuarioAtual.id, horas_sono: horas })
  if (resultado.sucesso) {
    exibirToast('Sono registrado! 😴')
    fecharModal('modal-sono')
    document.getElementById('sono-texto').textContent = `${horas}h de sono`
  }
}

// ==================== ENERGIA ====================

document.getElementById('input-energia').addEventListener('input', (e) => {
  document.getElementById('energia-valor').textContent = e.target.value
})

async function registrarEnergia() {
  const nivel = parseInt(document.getElementById('input-energia').value)
  const resultado = await api('POST', '/energia', { usuario_id: usuarioAtual.id, nivel_energia: nivel })
  if (resultado.sucesso) {
    exibirToast('Energia registrada! ⚡')
    fecharModal('modal-energia')
    document.getElementById('energia-texto').textContent = `${nivel}/10 de energia`
  }
}

// ==================== LEMBRETES ====================

function selecionarIcone(icone) {
  iconeSelecionado = icone
  document.querySelectorAll('.icone-btn').forEach(btn => {
    btn.classList.remove('border-mint-500', 'bg-mint-50')
    btn.classList.add('border-gray-200')
  })
  event.target.classList.remove('border-gray-200')
  event.target.classList.add('border-mint-500', 'bg-mint-50')
}

document.getElementById('form-lembrete').addEventListener('submit', async (e) => {
  e.preventDefault()
  const titulo = document.getElementById('lembrete-titulo').value.trim()

  const resultado = await api('POST', '/lembretes', {
    usuario_id: usuarioAtual.id,
    titulo,
    icone: iconeSelecionado
  })

  if (resultado.sucesso) {
    exibirToast('Lembrete criado! ⏰')
    fecharModal('modal-lembrete')
    document.getElementById('lembrete-titulo').value = ''
    carregarLembretes()
    atualizarBadge()
  }
})

async function carregarLembretes() {
  const resultado = await api('GET', `/lembretes/${usuarioAtual.id}`)
  const container = document.getElementById('lista-lembretes')

  if (resultado.dados.length === 0) {
    container.innerHTML = '<p class="text-gray-400 text-center py-4">Nenhum lembrete ainda</p>'
    return
  }

  container.innerHTML = resultado.dados.map(l => `
    <div class="flex items-center gap-3 p-3 rounded-xl ${l.concluido ? 'bg-gray-50 opacity-60' : 'bg-mint-50'}">
      <button onclick="alternarLembrete(${l.id})" class="w-6 h-6 rounded-full border-2 ${l.concluido ? 'bg-mint-500 border-mint-500' : 'border-mint-400'} flex items-center justify-center">
        ${l.concluido ? '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : ''}
      </button>
      <span class="text-xl">${l.icone}</span>
      <span class="flex-1 ${l.concluido ? 'line-through text-gray-400' : 'text-gray-700'}">${l.titulo}</span>
      <button onclick="removerLembrete(${l.id})" class="text-gray-400 hover:text-red-500 transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
  `).join('')
}

async function carregarTodosLembretes() {
  const resultado = await api('GET', `/lembretes/${usuarioAtual.id}`)
  const container = document.getElementById('lista-lembretes-tela')

  if (resultado.dados.length === 0) {
    container.innerHTML = '<p class="text-gray-400 text-center py-8">Nenhum lembrete criado</p>'
    return
  }

  container.innerHTML = resultado.dados.map(l => `
    <div class="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <button onclick="alternarLembrete(${l.id})" class="w-6 h-6 rounded-full border-2 ${l.concluido ? 'bg-mint-500 border-mint-500' : 'border-mint-400'} flex items-center justify-center">
        ${l.concluido ? '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : ''}
      </button>
      <span class="text-2xl">${l.icone}</span>
      <span class="flex-1 ${l.concluido ? 'line-through text-gray-400' : 'text-gray-700'} font-medium">${l.titulo}</span>
      <button onclick="removerLembrete(${l.id})" class="text-gray-400 hover:text-red-500 transition p-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </button>
    </div>
  `).join('')
}

async function alternarLembrete(id) {
  await api('PUT', `/lembretes/${id}/toggle`)
  carregarLembretes()
  carregarTodosLembretes()
  atualizarBadge()
}

async function removerLembrete(id) {
  if (confirm('Remover este lembrete?')) {
    await api('DELETE', `/lembretes/${id}`)
    exibirToast('Lembrete removido')
    carregarLembretes()
    carregarTodosLembretes()
    atualizarBadge()
  }
}

async function atualizarBadge() {
  const resultado = await api('GET', `/lembretes/${usuarioAtual.id}/pendentes`)
  const badge = document.getElementById('badge-notificacoes')
  if (resultado.total > 0) {
    badge.textContent = resultado.total
    badge.classList.remove('hidden')
  } else {
    badge.classList.add('hidden')
  }
}

// ==================== SUGESTÕES ====================

async function carregarSugestoes() {
  const resultado = await api('GET', `/sugestoes/${usuarioAtual.id}`)
  const container = document.getElementById('lista-sugestoes')

  if (resultado.dados.length === 0) {
    container.innerHTML = '<p class="text-gray-400 text-center py-4 col-span-3">Registre seu humor para ver sugestões</p>'
    return
  }

  container.innerHTML = resultado.dados.map(s => `
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div class="text-2xl mb-2">${s.icone}</div>
      <h4 class="font-semibold text-gray-800">${s.titulo}</h4>
      <p class="text-sm text-gray-600 mt-1">${s.descricao}</p>
    </div>
  `).join('')
}

// ==================== GRÁFICOS ====================

let graficoHumor = null
let graficoSono = null

async function carregarGraficos() {
  const dadosHumor = await api('GET', `/humor/${usuarioAtual.id}`)
  const dadosSono = await api('GET', `/sono/${usuarioAtual.id}`)

  // Mapear emojis para números
  const mapaEmoji = { '😊': 5, '😔': 2, '😰': 3, '😫': 2, '😤': 1, '😐': 3 }

  // Gráfico de Humor
  const labelsHumor = dadosHumor.dados.map(d => d.data_registro).reverse()
  const valoresHumor = dadosHumor.dados.map(d => mapaEmoji[d.emoji] || 3).reverse()

  if (graficoHumor) graficoHumor.destroy()
  graficoHumor = new Chart(document.getElementById('grafico-humor'), {
    type: 'line',
    data: {
      labels: labelsHumor,
      datasets: [{
        label: 'Humor',
        data: valoresHumor,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { min: 0, max: 6, ticks: { stepSize: 1 } }
      },
      plugins: { legend: { display: false } }
    }
  })

  // Gráfico de Sono
  const labelsSono = dadosSono.dados.map(d => d.data_registro).reverse()
  const valoresSono = dadosSono.dados.map(d => d.horas_sono).reverse()

  if (graficoSono) graficoSono.destroy()
  graficoSono = new Chart(document.getElementById('grafico-sono'), {
    type: 'bar',
    data: {
      labels: labelsSono,
      datasets: [{
        label: 'Horas de Sono',
        data: valoresSono,
        backgroundColor: '#a855f7',
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { min: 0, max: 12 }
      },
      plugins: { legend: { display: false } }
    }
  })
}

// ==================== PERFIL ====================

function carregarPerfil() {
  document.getElementById('perfil-nome').value = usuarioAtual.nome
  document.getElementById('perfil-email').value = usuarioAtual.email
  document.getElementById('perfil-idade').value = usuarioAtual.idade || ''
  document.getElementById('perfil-ocupacao').value = usuarioAtual.ocupacao || ''
}

document.getElementById('form-perfil').addEventListener('submit', async (e) => {
  e.preventDefault()
  const nome = document.getElementById('perfil-nome').value.trim()
  const idade = document.getElementById('perfil-idade').value
  const ocupacao = document.getElementById('perfil-ocupacao').value.trim()

  const resultado = await api('PUT', '/usuarios/perfil', {
    id: usuarioAtual.id,
    nome,
    idade: idade ? parseInt(idade) : null,
    ocupacao: ocupacao || null
  })

  if (resultado.sucesso) {
    usuarioAtual = resultado.usuario
    localStorage.setItem('dailymind_usuario', JSON.stringify(usuarioAtual))
    document.getElementById('nome-usuario').textContent = usuarioAtual.nome
    document.getElementById('inicial-usuario').textContent = usuarioAtual.nome.charAt(0).toUpperCase()
    exibirToast('Perfil atualizado!')
  }
})

// ==================== CARREGAMENTO INICIAL ====================

async function carregarDados() {
  carregarLembretes()
  atualizarBadge()
  carregarSugestoes()

  // Carregar dados de hoje
  const [humor, sono, energia] = await Promise.all([
    api('GET', `/humor/${usuarioAtual.id}/hoje`),
    api('GET', `/sono/${usuarioAtual.id}/hoje`),
    api('GET', `/energia/${usuarioAtual.id}/hoje`)
  ])

  if (humor.dado) {
    document.getElementById('humor-atual').textContent = humor.dado.emoji
    const textos = { '😊': 'Feliz', '😔': 'Triste', '😰': 'Ansioso', '😫': 'Cansado', '😤': 'Irritado' }
    document.getElementById('humor-texto').textContent = textos[humor.dado.emoji] || 'Registrado'
  }

  if (sono.dado) {
    document.getElementById('sono-texto').textContent = `${sono.dado.horas_sono}h de sono`
    document.getElementById('input-sono').value = sono.dado.horas_sono
    document.getElementById('sono-valor').textContent = sono.dado.horas_sono
  }

  if (energia.dado) {
    document.getElementById('energia-texto').textContent = `${energia.dado.nivel_energia}/10 de energia`
    document.getElementById('input-energia').value = energia.dado.nivel_energia
    document.getElementById('energia-valor').textContent = energia.dado.nivel_energia
  }
}

// Verificar se já está logado
window.addEventListener('DOMContentLoaded', () => {
  const salvo = localStorage.getItem('dailymind_usuario')
  if (salvo) {
    usuarioAtual = JSON.parse(salvo)
    entrarApp()
  }
})
