const URL_API = '/api'

let usuarioAtual = null

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

document.getElementById('form-cadastro').querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const nome = document.getElementById('cadastro-nome').value.trim()
  const email = document.getElementById('cadastro-email').value.trim()
  const senha = document.getElementById('cadastro-senha').value
  const tipo_usuario = document.getElementById('cadastro-tipo').value

  const resultado = await api('POST', '/usuarios/cadastro', { nome, email, senha, tipo_usuario })

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
  document.getElementById('tela-tarefas').classList.add('hidden')
  document.getElementById('tela-perfil').classList.add('hidden')
  document.getElementById(`tela-${tela}`).classList.remove('hidden')

  if (tela === 'graficos') carregarGraficos()
  if (tela === 'tarefas') carregarTodasTarefas()
  if (tela === 'perfil') carregarPerfil()
}

function mostrarPerfil() {
  mostrarTela('perfil')
}

// ==================== MODAIS ====================

function abrirModalHumor() { document.getElementById('modal-humor').classList.remove('hidden') }
function abrirModalSono() { document.getElementById('modal-sono').classList.remove('hidden') }
function abrirModalEnergia() { document.getElementById('modal-energia').classList.remove('hidden') }
function abrirModalTarefa() { document.getElementById('modal-tarefa').classList.remove('hidden') }
function abrirModalMeta() { document.getElementById('modal-meta').classList.remove('hidden') }
function fecharModal(id) { document.getElementById(id).classList.add('hidden') }

// ==================== HUMOR ====================

document.getElementById('humor-intensidade').addEventListener('input', (e) => {
  document.getElementById('humor-intensidade-valor').textContent = e.target.value
})

async function registrarHumor() {
  const humor = document.getElementById('humor-select').value
  const intensidade = parseInt(document.getElementById('humor-intensidade').value)
  const observacao = document.getElementById('humor-observacao').value.trim() || null

  const resultado = await api('POST', '/humor', {
    id_usuario: usuarioAtual.id_usuario,
    humor,
    intensidade,
    observacao
  })

  if (resultado.sucesso) {
    const emojis = { feliz: '😊', triste: '😔', ansioso: '😰', cansado: '😫', irritado: '😤', neutro: '😐' }
    exibirToast('Humor registrado! 😊')
    fecharModal('modal-humor')
    document.getElementById('humor-atual').textContent = emojis[humor] || '😐'
    document.getElementById('humor-texto').textContent = humor.charAt(0).toUpperCase() + humor.slice(1)
    document.getElementById('humor-observacao').value = ''
  }
}

// ==================== SONO ====================

document.getElementById('input-sono').addEventListener('input', (e) => {
  document.getElementById('sono-valor').textContent = e.target.value
})

document.getElementById('sono-qualidade').addEventListener('input', (e) => {
  document.getElementById('sono-qualidade-valor').textContent = e.target.value
})

async function registrarSono() {
  const horas_dormidas = parseFloat(document.getElementById('input-sono').value)
  const qualidade = parseInt(document.getElementById('sono-qualidade').value)
  const observacao = document.getElementById('sono-observacao').value.trim() || null

  const resultado = await api('POST', '/sono', {
    id_usuario: usuarioAtual.id_usuario,
    horas_dormidas,
    qualidade,
    observacao
  })

  if (resultado.sucesso) {
    exibirToast('Sono registrado! 😴')
    fecharModal('modal-sono')
    document.getElementById('sono-texto').textContent = `${horas_dormidas}h de sono`
    document.getElementById('sono-observacao').value = ''
  }
}

// ==================== ENERGIA ====================

document.getElementById('input-energia').addEventListener('input', (e) => {
  document.getElementById('energia-valor').textContent = e.target.value
})

async function registrarEnergia() {
  const nivel = parseInt(document.getElementById('input-energia').value)
  const observacao = document.getElementById('energia-observacao').value.trim() || null

  const resultado = await api('POST', '/energia', {
    id_usuario: usuarioAtual.id_usuario,
    nivel,
    observacao
  })

  if (resultado.sucesso) {
    exibirToast('Energia registrada! ⚡')
    fecharModal('modal-energia')
    document.getElementById('energia-texto').textContent = `${nivel}/5 de energia`
    document.getElementById('energia-observacao').value = ''
  }
}

// ==================== TAREFAS ====================

document.getElementById('form-tarefa').addEventListener('submit', async (e) => {
  e.preventDefault()
  const titulo = document.getElementById('tarefa-titulo').value.trim()
  const descricao = document.getElementById('tarefa-descricao').value.trim() || null
  const data = document.getElementById('tarefa-data').value || null
  const horario = document.getElementById('tarefa-horario').value || null
  const categoria = document.getElementById('tarefa-categoria').value || null

  const resultado = await api('POST', '/tarefas', {
    id_usuario: usuarioAtual.id_usuario,
    titulo,
    descricao,
    data,
    horario,
    categoria
  })

  if (resultado.sucesso) {
    exibirToast('Tarefa criada! ✅')
    fecharModal('modal-tarefa')
    document.getElementById('tarefa-titulo').value = ''
    document.getElementById('tarefa-descricao').value = ''
    document.getElementById('tarefa-data').value = ''
    document.getElementById('tarefa-horario').value = ''
    document.getElementById('tarefa-categoria').value = ''
    carregarTarefas()
    atualizarBadge()
  }
})

async function carregarTarefas() {
  const resultado = await api('GET', `/tarefas/${usuarioAtual.id_usuario}`)
  const container = document.getElementById('lista-tarefas')

  if (resultado.dados.length === 0) {
    container.innerHTML = '<p class="text-gray-400 text-center py-4">Nenhuma tarefa ainda</p>'
    return
  }

  const categorias = { saude: '🏥', estudo: '📚', trabalho: '💼', lazer: '🎮', casa: '🏠', outro: '📋' }

  container.innerHTML = resultado.dados.map(t => `
    <div class="flex items-center gap-3 p-3 rounded-xl ${t.concluida ? 'bg-gray-50 opacity-60' : 'bg-mint-50'}">
      <button onclick="alternarTarefa(${t.id_tarefa})" class="w-6 h-6 rounded-full border-2 ${t.concluida ? 'bg-mint-500 border-mint-500' : 'border-mint-400'} flex items-center justify-center">
        ${t.concluida ? '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : ''}
      </button>
      <span class="text-xl">${categorias[t.categoria] || '📋'}</span>
      <div class="flex-1">
        <span class="${t.concluida ? 'line-through text-gray-400' : 'text-gray-700'}">${t.titulo}</span>
        ${t.horario ? `<span class="text-xs text-gray-400 ml-2">${t.horario}</span>` : ''}
      </div>
      <button onclick="removerTarefa(${t.id_tarefa})" class="text-gray-400 hover:text-red-500 transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
  `).join('')
}

async function carregarTodasTarefas() {
  const resultado = await api('GET', `/tarefas/${usuarioAtual.id_usuario}`)
  const container = document.getElementById('lista-tarefas-tela')

  if (resultado.dados.length === 0) {
    container.innerHTML = '<p class="text-gray-400 text-center py-8">Nenhuma tarefa criada</p>'
    return
  }

  const categorias = { saude: '🏥', estudo: '📚', trabalho: '💼', lazer: '🎮', casa: '🏠', outro: '📋' }

  container.innerHTML = resultado.dados.map(t => `
    <div class="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <button onclick="alternarTarefa(${t.id_tarefa})" class="w-6 h-6 rounded-full border-2 ${t.concluida ? 'bg-mint-500 border-mint-500' : 'border-mint-400'} flex items-center justify-center">
        ${t.concluida ? '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : ''}
      </button>
      <span class="text-2xl">${categorias[t.categoria] || '📋'}</span>
      <div class="flex-1">
        <span class="flex-1 ${t.concluida ? 'line-through text-gray-400' : 'text-gray-700'} font-medium">${t.titulo}</span>
        ${t.data ? `<span class="text-xs text-gray-400 block">${t.data}${t.horario ? ' às ' + t.horario : ''}</span>` : ''}
      </div>
      <button onclick="removerTarefa(${t.id_tarefa})" class="text-gray-400 hover:text-red-500 transition p-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </button>
    </div>
  `).join('')
}

async function alternarTarefa(id) {
  await api('PUT', `/tarefas/${id}/toggle`)
  carregarTarefas()
  carregarTodasTarefas()
  atualizarBadge()
}

async function removerTarefa(id) {
  if (confirm('Remover esta tarefa?')) {
    await api('DELETE', `/tarefas/${id}`)
    exibirToast('Tarefa removida')
    carregarTarefas()
    carregarTodasTarefas()
    atualizarBadge()
  }
}

async function atualizarBadge() {
  const resultado = await api('GET', `/tarefas/${usuarioAtual.id_usuario}/pendentes`)
  const badge = document.getElementById('badge-notificacoes')
  if (resultado.total > 0) {
    badge.textContent = resultado.total
    badge.classList.remove('hidden')
  } else {
    badge.classList.add('hidden')
  }
}

// ==================== METAS ====================

document.getElementById('form-meta').addEventListener('submit', async (e) => {
  e.preventDefault()
  const titulo = document.getElementById('meta-titulo').value.trim()
  const descricao = document.getElementById('meta-descricao').value.trim() || null
  const data_inicio = document.getElementById('meta-data-inicio').value || null
  const data_fim = document.getElementById('meta-data-fim').value || null

  const resultado = await api('POST', '/metas', {
    id_usuario: usuarioAtual.id_usuario,
    titulo,
    descricao,
    data_inicio,
    data_fim
  })

  if (resultado.sucesso) {
    exibirToast('Meta criada! 🎯')
    fecharModal('modal-meta')
    document.getElementById('meta-titulo').value = ''
    document.getElementById('meta-descricao').value = ''
    document.getElementById('meta-data-inicio').value = ''
    document.getElementById('meta-data-fim').value = ''
    carregarMetas()
  }
})

async function carregarMetas() {
  const resultado = await api('GET', `/metas/${usuarioAtual.id_usuario}`)
  const container = document.getElementById('lista-metas')

  if (resultado.dados.length === 0) {
    container.innerHTML = '<p class="text-gray-400 text-center py-4">Nenhuma meta ainda</p>'
    return
  }

  container.innerHTML = resultado.dados.map(m => `
    <div class="flex items-center gap-3 p-3 rounded-xl ${m.concluida ? 'bg-gray-50 opacity-60' : 'bg-purple-50'}">
      <button onclick="alternarMeta(${m.id_meta})" class="w-6 h-6 rounded-full border-2 ${m.concluida ? 'bg-purple-500 border-purple-500' : 'border-purple-400'} flex items-center justify-center">
        ${m.concluida ? '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : ''}
      </button>
      <span class="text-xl">🎯</span>
      <div class="flex-1">
        <span class="${m.concluida ? 'line-through text-gray-400' : 'text-gray-700'}">${m.titulo}</span>
        ${m.data_fim ? `<span class="text-xs text-gray-400 block">Até: ${m.data_fim}</span>` : ''}
      </div>
      <button onclick="removerMeta(${m.id_meta})" class="text-gray-400 hover:text-red-500 transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
  `).join('')
}

async function alternarMeta(id) {
  await api('PUT', `/metas/${id}/toggle`)
  carregarMetas()
}

async function removerMeta(id) {
  if (confirm('Remover esta meta?')) {
    await api('DELETE', `/metas/${id}`)
    exibirToast('Meta removida')
    carregarMetas()
  }
}

// ==================== GRÁFICOS ====================

let graficoHumor = null
let graficoSono = null
let graficoEnergia = null

async function carregarGraficos() {
  const dadosHumor = await api('GET', `/humor/${usuarioAtual.id_usuario}`)
  const dadosSono = await api('GET', `/sono/${usuarioAtual.id_usuario}`)
  const dadosEnergia = await api('GET', `/energia/${usuarioAtual.id_usuario}`)

  // Gráfico de Humor
  const labelsHumor = dadosHumor.dados.map(d => d.data).reverse()
  const valoresHumor = dadosHumor.dados.map(d => d.intensidade).reverse()

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
  const labelsSono = dadosSono.dados.map(d => d.data).reverse()
  const valoresSono = dadosSono.dados.map(d => d.horas_dormidas).reverse()

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

  // Gráfico de Energia
  const labelsEnergia = dadosEnergia.dados.map(d => d.data).reverse()
  const valoresEnergia = dadosEnergia.dados.map(d => d.nivel).reverse()

  if (graficoEnergia) graficoEnergia.destroy()
  graficoEnergia = new Chart(document.getElementById('grafico-energia'), {
    type: 'bar',
    data: {
      labels: labelsEnergia,
      datasets: [{
        label: 'Nível de Energia',
        data: valoresEnergia,
        backgroundColor: '#eab308',
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { min: 0, max: 5, ticks: { stepSize: 1 } }
      },
      plugins: { legend: { display: false } }
    }
  })
}

// ==================== PERFIL ====================

function carregarPerfil() {
  document.getElementById('perfil-nome').value = usuarioAtual.nome
  document.getElementById('perfil-email').value = usuarioAtual.email
  document.getElementById('perfil-tipo').value = usuarioAtual.tipo_usuario || 'usuário'
}

document.getElementById('form-perfil').addEventListener('submit', async (e) => {
  e.preventDefault()
  const nome = document.getElementById('perfil-nome').value.trim()
  const tipo_usuario = document.getElementById('perfil-tipo').value

  const resultado = await api('PUT', '/usuarios/perfil', {
    id_usuario: usuarioAtual.id_usuario,
    nome,
    tipo_usuario
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
  carregarTarefas()
  atualizarBadge()
  carregarMetas()

  const [humor, sono, energia] = await Promise.all([
    api('GET', `/humor/${usuarioAtual.id_usuario}/hoje`),
    api('GET', `/sono/${usuarioAtual.id_usuario}/hoje`),
    api('GET', `/energia/${usuarioAtual.id_usuario}/hoje`)
  ])

  if (humor.dado) {
    const emojis = { feliz: '😊', triste: '😔', ansioso: '😰', cansado: '😫', irritado: '😤', neutro: '😐' }
    document.getElementById('humor-atual').textContent = emojis[humor.dado.humor] || '😐'
    document.getElementById('humor-texto').textContent = humor.dado.humor.charAt(0).toUpperCase() + humor.dado.humor.slice(1)
  }

  if (sono.dado) {
    document.getElementById('sono-texto').textContent = `${sono.dado.horas_dormidas}h de sono`
    document.getElementById('input-sono').value = sono.dado.horas_dormidas
    document.getElementById('sono-valor').textContent = sono.dado.horas_dormidas
  }

  if (energia.dado) {
    document.getElementById('energia-texto').textContent = `${energia.dado.nivel}/5 de energia`
    document.getElementById('input-energia').value = energia.dado.nivel
    document.getElementById('energia-valor').textContent = energia.dado.nivel
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
