const validator = require('validator')

// Remove espaços extras e escapa caracteres especiais
function sanitizar(texto) {
  return validator.trim(validator.escape(texto || ''))
}

// Valida e sanitiza os dados recebidos do formulário de lead
function validarLead(dados) {
  const erros = []
  const nome = sanitizar(dados.nome_completo)
  const email = sanitizar(dados.email)
  const telefone = sanitizar(dados.telefone_whatsapp)
  const mensagem = sanitizar(dados.mensagem || '')

  if (!nome || nome.length < 3 || nome.length > 150)
    erros.push('Nome completo deve ter entre 3 e 150 caracteres.')

  if (!validator.isEmail(email))
    erros.push('E-mail inválido.')

  const apenasDigitos = telefone.replace(/\D/g, '')
  if (apenasDigitos.length < 10 || apenasDigitos.length > 15)
    erros.push('Telefone WhatsApp inválido. Informe um número com DDD.')

  if (mensagem.length > 500)
    erros.push('Mensagem deve ter no máximo 500 caracteres.')

  return {
    valido: erros.length === 0,
    erros,
    dados: { nome_completo: nome, email, telefone_whatsapp: apenasDigitos, mensagem }
  }
}

// Valida dados de tarefa (checklist)
function validarTarefa(dados) {
  const erros = []
  const { usuario_id, titulo, descricao, icone } = dados

  if (!usuario_id || typeof usuario_id !== 'number' || usuario_id <= 0)
    erros.push('ID de usuário inválido.')

  if (!titulo || typeof titulo !== 'string')
    erros.push('Título é obrigatório.')

  const tituloSanitizado = sanitizar(titulo)
  if (tituloSanitizado.length < 3 || tituloSanitizado.length > 255)
    erros.push('Título deve ter entre 3 e 255 caracteres.')

  if (descricao && typeof descricao === 'string') {
    const descricaoSanitizada = sanitizar(descricao)
    if (descricaoSanitizada.length > 1000)
      erros.push('Descrição deve ter no máximo 1000 caracteres.')
  }

  if (icone && typeof icone === 'string' && icone.length > 10)
    erros.push('Ícone inválido.')

  return {
    valido: erros.length === 0,
    erros,
    dados: {
      usuario_id,
      titulo: tituloSanitizado,
      descricao: descricao ? sanitizar(descricao) : null,
      icone: icone || '✓'
    }
  }
}

// Valida dados de meta (objetivo com período)
function validarMeta(dados) {
  const erros = []
  const { usuario_id, titulo, descricao, icone, data_inicio, data_fim } = dados

  if (!usuario_id || typeof usuario_id !== 'number' || usuario_id <= 0)
    erros.push('ID de usuário inválido.')

  if (!titulo || typeof titulo !== 'string')
    erros.push('Título é obrigatório.')

  const tituloSanitizado = sanitizar(titulo)
  if (tituloSanitizado.length < 3 || tituloSanitizado.length > 255)
    erros.push('Título deve ter entre 3 e 255 caracteres.')

  if (descricao && typeof descricao === 'string') {
    const descricaoSanitizada = sanitizar(descricao)
    if (descricaoSanitizada.length > 1000)
      erros.push('Descrição deve ter no máximo 1000 caracteres.')
  }

  // Validar datas
  if (!data_inicio || !data_fim) {
    erros.push('Data de início e data de término são obrigatórias.')
  } else {
    const inicio = new Date(data_inicio)
    const fim = new Date(data_fim)

    if (isNaN(inicio.getTime()))
      erros.push('Data de início inválida.')

    if (isNaN(fim.getTime()))
      erros.push('Data de término inválida.')

    if (fim <= inicio)
      erros.push('A data de término deve ser posterior à data de início.')
  }

  if (icone && typeof icone === 'string' && icone.length > 10)
    erros.push('Ícone inválido.')

  return {
    valido: erros.length === 0,
    erros,
    dados: {
      usuario_id,
      titulo: tituloSanitizado,
      descricao: descricao ? sanitizar(descricao) : null,
      icone: icone || '🎯',
      data_inicio,
      data_fim
    }
  }
}

// Valida progresso de meta (0-100)
function validarProgresso(progresso) {
  const erros = []

  if (typeof progresso !== 'number' || isNaN(progresso))
    erros.push('Progresso deve ser um número.')

  if (progresso < 0 || progresso > 100)
    erros.push('Progresso deve estar entre 0 e 100.')

  return {
    valido: erros.length === 0,
    erros,
    dados: { progresso: Math.round(progresso) }
  }
}

module.exports = { sanitizar, validarLead, validarTarefa, validarMeta, validarProgresso }
