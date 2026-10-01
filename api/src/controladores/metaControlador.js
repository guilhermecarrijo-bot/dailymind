const banco = require('../config/conexaoBanco')

function dataIsoValida(data) {
  if (typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data)) return false
  const dataConvertida = new Date(`${data}T00:00:00Z`)
  return !Number.isNaN(dataConvertida.getTime()) && dataConvertida.toISOString().slice(0, 10) === data
}

// Calcular status da meta baseado nas datas
function calcularStatus(data_inicio, data_fim) {
  const hoje = new Date().toISOString().slice(0, 10)

  if (hoje < data_inicio) {
    return 'não_iniciada'
  } else if (hoje <= data_fim) {
    return 'em_andamento'
  } else {
    return 'concluida'
  }
}

// Calcular dias restantes
function calcularDiasRestantes(data_inicio, data_fim) {
  const hoje = Date.parse(`${new Date().toISOString().slice(0, 10)}T00:00:00Z`)
  const fim = Date.parse(`${data_fim}T00:00:00Z`)
  return Math.max(0, Math.ceil((fim - hoje) / (1000 * 60 * 60 * 24)))
}

// Calcular progresso automático baseado no período transcorrido
function calcularProgressoAutomatico(data_inicio, data_fim) {
  const hoje = Date.parse(`${new Date().toISOString().slice(0, 10)}T00:00:00Z`)
  const inicio = Date.parse(`${data_inicio}T00:00:00Z`)
  const fim = Date.parse(`${data_fim}T00:00:00Z`)

  if (hoje < inicio) {
    return 0
  } else if (hoje >= fim) {
    return 100
  } else {
    const totalMs = fim - inicio
    const decorridos = hoje - inicio
    return Math.round((decorridos / totalMs) * 100)
  }
}

function representarMeta(meta) {
  return {
    ...meta,
    status: calcularStatus(meta.data_inicio, meta.data_fim),
    progresso: meta.progresso_manual
      ? meta.progresso
      : calcularProgressoAutomatico(meta.data_inicio, meta.data_fim),
    dias_restantes: calcularDiasRestantes(meta.data_inicio, meta.data_fim)
  }
}

// Criar meta
function criarMeta(req, res) {
  const { usuario_id, titulo, descricao, icone, data_inicio, data_fim } = req.body

  if (!usuario_id || typeof titulo !== 'string' || !titulo.trim() || titulo.trim().length > 200 || !data_inicio || !data_fim) {
    return res.status(422).json({
      sucesso: false,
      mensagem: 'Usuário, título, data de início e data de fim são obrigatórios.'
    })
  }
  if (descricao !== undefined && descricao !== null && typeof descricao !== 'string') {
    return res.status(422).json({ sucesso: false, mensagem: 'A descrição deve ser um texto.' })
  }
  if (icone !== undefined && (typeof icone !== 'string' || icone.length > 10)) {
    return res.status(422).json({ sucesso: false, mensagem: 'Ícone inválido.' })
  }

  // Validar se data_fim é posterior a data_inicio
  if (!dataIsoValida(data_inicio) || !dataIsoValida(data_fim) || data_fim <= data_inicio) {
    return res.status(422).json({
      sucesso: false,
      mensagem: 'A data de término deve ser posterior à data de início.'
    })
  }

  const status = calcularStatus(data_inicio, data_fim)
  const progresso = calcularProgressoAutomatico(data_inicio, data_fim)

  const inserir = banco.prepare(
    'INSERT INTO metas (usuario_id, titulo, descricao, icone, data_inicio, data_fim, status, progresso) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  )
  const resultado = inserir.run(usuario_id, titulo.trim(), descricao?.trim() || null, icone || '🎯', data_inicio, data_fim, status, progresso)

  res.status(201).json({
    sucesso: true,
    mensagem: 'Meta criada com sucesso!',
    meta: {
      id: resultado.lastInsertRowid,
      usuario_id,
      titulo: titulo.trim(),
      descricao: descricao?.trim() || null,
      icone: icone || '🎯',
      data_inicio,
      data_fim,
      status,
      progresso,
      dias_restantes: calcularDiasRestantes(data_inicio, data_fim),
      data_criacao: new Date().toISOString()
    }
  })
}

// Listar metas do usuário
function listarMetas(req, res) {
  const usuario_id = req.params.usuario_id
  const { status: filtroStatus } = req.query // 'não_iniciada', 'em_andamento', 'concluida', 'todas'

  const metas = banco.prepare('SELECT * FROM metas WHERE usuario_id = ? ORDER BY data_fim ASC').all(usuario_id)
    .map(representarMeta)
  const metasFiltradas = filtroStatus && filtroStatus !== 'todas'
    ? metas.filter(meta => meta.status === filtroStatus)
    : metas

  res.json({ sucesso: true, dados: metasFiltradas, total: metasFiltradas.length })
}

// Obter meta por ID
function obterMeta(req, res) {
  const { id } = req.params

  const meta = banco.prepare('SELECT * FROM metas WHERE id = ?').get(id)
  if (!meta) {
    return res.status(404).json({ sucesso: false, mensagem: 'Meta não encontrada.' })
  }

  res.json({ sucesso: true, dados: representarMeta(meta) })
}

// Atualizar meta
function atualizarMeta(req, res) {
  const { id } = req.params
  const { titulo, descricao, icone, data_inicio, data_fim } = req.body

  if (titulo !== undefined && (typeof titulo !== 'string' || !titulo.trim() || titulo.trim().length > 200)) {
    return res.status(422).json({ sucesso: false, mensagem: 'O título deve ter entre 1 e 200 caracteres.' })
  }
  if (descricao !== undefined && descricao !== null && typeof descricao !== 'string') {
    return res.status(422).json({ sucesso: false, mensagem: 'A descrição deve ser um texto.' })
  }
  if (icone !== undefined && (typeof icone !== 'string' || icone.length > 10)) {
    return res.status(422).json({ sucesso: false, mensagem: 'Ícone inválido.' })
  }

  const meta = banco.prepare('SELECT * FROM metas WHERE id = ?').get(id)
  if (!meta) {
    return res.status(404).json({ sucesso: false, mensagem: 'Meta não encontrada.' })
  }

  const novaDataInicio = data_inicio || meta.data_inicio
  const novaDataFim = data_fim || meta.data_fim
  if (!dataIsoValida(novaDataInicio) || !dataIsoValida(novaDataFim) || novaDataFim <= novaDataInicio) {
    return res.status(422).json({
      sucesso: false,
      mensagem: 'A data de término deve ser posterior à data de início.'
    })
  }

  const periodoAlterado = novaDataInicio !== meta.data_inicio || novaDataFim !== meta.data_fim
  const progressoManual = periodoAlterado ? 0 : meta.progresso_manual
  const novoStatus = calcularStatus(novaDataInicio, novaDataFim)
  const novoProgresso = progressoManual
    ? meta.progresso
    : calcularProgressoAutomatico(novaDataInicio, novaDataFim)

  banco.prepare(
    'UPDATE metas SET titulo = ?, descricao = ?, icone = ?, data_inicio = ?, data_fim = ?, status = ?, progresso = ?, progresso_manual = ? WHERE id = ?'
  ).run(
    titulo?.trim() || meta.titulo,
    descricao !== undefined ? descricao?.trim() || null : meta.descricao,
    icone || meta.icone,
    novaDataInicio,
    novaDataFim,
    novoStatus,
    novoProgresso,
    progressoManual,
    id
  )

  res.json({
    sucesso: true,
    mensagem: 'Meta atualizada com sucesso!',
    meta: {
      id,
      titulo: titulo?.trim() || meta.titulo,
      descricao: descricao !== undefined ? descricao?.trim() || null : meta.descricao,
      icone: icone || meta.icone,
      data_inicio: novaDataInicio,
      data_fim: novaDataFim,
      status: novoStatus,
      progresso: novoProgresso,
      dias_restantes: calcularDiasRestantes(novaDataInicio, novaDataFim)
    }
  })
}

// Atualizar progresso manualmente (opcional)
function atualizarProgresso(req, res) {
  const { id } = req.params
  const { progresso } = req.body

  if (progresso === undefined || !Number.isInteger(progresso) || progresso < 0 || progresso > 100) {
    return res.status(422).json({
      sucesso: false,
      mensagem: 'Progresso deve ser um número entre 0 e 100.'
    })
  }

  const meta = banco.prepare('SELECT * FROM metas WHERE id = ?').get(id)
  if (!meta) {
    return res.status(404).json({ sucesso: false, mensagem: 'Meta não encontrada.' })
  }

  banco.prepare('UPDATE metas SET progresso = ?, progresso_manual = 1 WHERE id = ?').run(progresso, id)

  res.json({
    sucesso: true,
    mensagem: 'Progresso atualizado com sucesso!',
    meta: { id, progresso }
  })
}

// Remover meta
function removerMeta(req, res) {
  const { id } = req.params

  const meta = banco.prepare('SELECT * FROM metas WHERE id = ?').get(id)
  if (!meta) {
    return res.status(404).json({ sucesso: false, mensagem: 'Meta não encontrada.' })
  }

  banco.prepare('DELETE FROM metas WHERE id = ?').run(id)
  res.json({ sucesso: true, mensagem: 'Meta removida com sucesso!' })
}

// Obter metas ativas (em andamento)
function obterMetasAtivas(req, res) {
  const usuario_id = req.params.usuario_id

  const metasAtualizadas = banco.prepare(
    'SELECT * FROM metas WHERE usuario_id = ? ORDER BY data_fim ASC'
  ).all(usuario_id).map(representarMeta)
  const metasAtivas = metasAtualizadas.filter(meta => meta.status === 'em_andamento')

  res.json({
    sucesso: true,
    dados: metasAtivas,
    total: metasAtivas.length
  })
}

// Obter estatísticas de metas
function obterEstatisticas(req, res) {
  const usuario_id = req.params.usuario_id

  const metas = banco.prepare('SELECT * FROM metas WHERE usuario_id = ?').all(usuario_id)

  const atualizada = metas.map(representarMeta)

  const total = atualizada.length
  const naoIniciada = atualizada.filter(m => m.status === 'não_iniciada').length
  const emAndamento = atualizada.filter(m => m.status === 'em_andamento').length
  const concluida = atualizada.filter(m => m.status === 'concluida').length
  const progressoMedio = total > 0 ? Math.round(atualizada.reduce((acc, m) => acc + m.progresso, 0) / total) : 0

  res.json({
    sucesso: true,
    estatisticas: {
      total,
      não_iniciada: naoIniciada,
      em_andamento: emAndamento,
      concluida,
      progresso_medio: progressoMedio
    }
  })
}

module.exports = {
  criarMeta,
  listarMetas,
  obterMeta,
  atualizarMeta,
  atualizarProgresso,
  removerMeta,
  obterMetasAtivas,
  obterEstatisticas
}
