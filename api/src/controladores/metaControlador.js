const banco = require('../config/conexaoBanco')

// Calcular status da meta baseado nas datas
function calcularStatus(data_inicio, data_fim) {
  const hoje = new Date()
  const inicio = new Date(data_inicio)
  const fim = new Date(data_fim)

  if (hoje < inicio) {
    return 'não_iniciada'
  } else if (hoje >= inicio && hoje <= fim) {
    return 'em_andamento'
  } else {
    return 'concluida'
  }
}

// Calcular dias restantes
function calcularDiasRestantes(data_inicio, data_fim) {
  const hoje = new Date()
  const fim = new Date(data_fim)
  const diffMs = fim - hoje
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDias)
}

// Calcular progresso automático baseado no período transcorrido
function calcularProgressoAutomatico(data_inicio, data_fim) {
  const hoje = new Date()
  const inicio = new Date(data_inicio)
  const fim = new Date(data_fim)

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

// Criar meta
function criarMeta(req, res) {
  const { usuario_id, titulo, descricao, icone, data_inicio, data_fim } = req.body

  if (!usuario_id || !titulo || !data_inicio || !data_fim) {
    return res.status(422).json({
      sucesso: false,
      mensagem: 'Usuário, título, data de início e data de fim são obrigatórios.'
    })
  }

  // Validar se data_fim é posterior a data_inicio
  const inicio = new Date(data_inicio)
  const fim = new Date(data_fim)
  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime()) || fim <= inicio) {
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
  const resultado = inserir.run(usuario_id, titulo, descricao || null, icone || '🎯', data_inicio, data_fim, status, progresso)

  res.status(201).json({
    sucesso: true,
    mensagem: 'Meta criada com sucesso!',
    meta: {
      id: resultado.lastInsertRowid,
      usuario_id,
      titulo,
      descricao: descricao || null,
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

  let sql = 'SELECT * FROM metas WHERE usuario_id = ?'
  const parametros = [usuario_id]

  if (filtroStatus && filtroStatus !== 'todas') {
    sql += ' AND status = ?'
    parametros.push(filtroStatus)
  }

  sql += ' ORDER BY data_fim ASC'

  const metas = banco.prepare(sql).all(...parametros)

  // Atualizar status e progresso em tempo real
  const metasAtualizadas = metas.map(meta => {
    const statusAtual = calcularStatus(meta.data_inicio, meta.data_fim)
    const progressoAtual = calcularProgressoAutomatico(meta.data_inicio, meta.data_fim)
    return {
      ...meta,
      status: statusAtual,
      progresso: progressoAtual,
      dias_restantes: calcularDiasRestantes(meta.data_inicio, meta.data_fim)
    }
  })

  res.json({ sucesso: true, dados: metasAtualizadas, total: metasAtualizadas.length })
}

// Obter meta por ID
function obterMeta(req, res) {
  const { id } = req.params

  const meta = banco.prepare('SELECT * FROM metas WHERE id = ?').get(id)
  if (!meta) {
    return res.status(404).json({ sucesso: false, mensagem: 'Meta não encontrada.' })
  }

  const statusAtual = calcularStatus(meta.data_inicio, meta.data_fim)
  const progressoAtual = calcularProgressoAutomatico(meta.data_inicio, meta.data_fim)

  res.json({
    sucesso: true,
    dados: {
      ...meta,
      status: statusAtual,
      progresso: progressoAtual,
      dias_restantes: calcularDiasRestantes(meta.data_inicio, meta.data_fim)
    }
  })
}

// Atualizar meta
function atualizarMeta(req, res) {
  const { id } = req.params
  const { titulo, descricao, icone, data_inicio, data_fim } = req.body

  const meta = banco.prepare('SELECT * FROM metas WHERE id = ?').get(id)
  if (!meta) {
    return res.status(404).json({ sucesso: false, mensagem: 'Meta não encontrada.' })
  }

  // Validar datas se fornecidas
  if (data_inicio && data_fim) {
    const inicio = new Date(data_inicio)
    const fim = new Date(data_fim)
    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime()) || fim <= inicio) {
      return res.status(422).json({
        sucesso: false,
        mensagem: 'A data de término deve ser posterior à data de início.'
      })
    }
  }

  const novaDataInicio = data_inicio || meta.data_inicio
  const novaDataFim = data_fim || meta.data_fim
  const novoStatus = calcularStatus(novaDataInicio, novaDataFim)
  const novoProgresso = calcularProgressoAutomatico(novaDataInicio, novaDataFim)

  banco.prepare(
    'UPDATE metas SET titulo = ?, descricao = ?, icone = ?, data_inicio = ?, data_fim = ?, status = ?, progresso = ? WHERE id = ?'
  ).run(
    titulo || meta.titulo,
    descricao !== undefined ? descricao : meta.descricao,
    icone || meta.icone,
    novaDataInicio,
    novaDataFim,
    novoStatus,
    novoProgresso,
    id
  )

  res.json({
    sucesso: true,
    mensagem: 'Meta atualizada com sucesso!',
    meta: {
      id,
      titulo: titulo || meta.titulo,
      descricao: descricao !== undefined ? descricao : meta.descricao,
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

  if (progresso === undefined || typeof progresso !== 'number' || progresso < 0 || progresso > 100) {
    return res.status(422).json({
      sucesso: false,
      mensagem: 'Progresso deve ser um número entre 0 e 100.'
    })
  }

  const meta = banco.prepare('SELECT * FROM metas WHERE id = ?').get(id)
  if (!meta) {
    return res.status(404).json({ sucesso: false, mensagem: 'Meta não encontrada.' })
  }

  banco.prepare('UPDATE metas SET progresso = ? WHERE id = ?').run(progresso, id)

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

  const metas = banco.prepare(
    'SELECT * FROM metas WHERE usuario_id = ? AND status = ? ORDER BY data_fim ASC'
  ).all(usuario_id, 'em_andamento')

  const metasAtualizadas = metas.map(meta => ({
    ...meta,
    dias_restantes: calcularDiasRestantes(meta.data_inicio, meta.data_fim)
  }))

  res.json({
    sucesso: true,
    dados: metasAtualizadas,
    total: metasAtualizadas.length
  })
}

// Obter estatísticas de metas
function obterEstatisticas(req, res) {
  const usuario_id = req.params.usuario_id

  const metas = banco.prepare('SELECT * FROM metas WHERE usuario_id = ?').all(usuario_id)

  const atualizada = metas.map(meta => ({
    ...meta,
    status: calcularStatus(meta.data_inicio, meta.data_fim),
    progresso: calcularProgressoAutomatico(meta.data_inicio, meta.data_fim)
  }))

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
