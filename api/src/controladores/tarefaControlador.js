const banco = require('../config/conexaoBanco')

// Criar tarefa
function criarTarefa(req, res) {
  const { usuario_id, titulo, descricao, icone } = req.body

  if (!usuario_id || typeof titulo !== 'string' || !titulo.trim() || titulo.trim().length > 200) {
    return res.status(422).json({ sucesso: false, mensagem: 'Usuário e título são obrigatórios.' })
  }
  if (descricao !== undefined && descricao !== null && typeof descricao !== 'string') {
    return res.status(422).json({ sucesso: false, mensagem: 'A descrição deve ser um texto.' })
  }
  if (icone !== undefined && (typeof icone !== 'string' || icone.length > 10)) {
    return res.status(422).json({ sucesso: false, mensagem: 'Ícone inválido.' })
  }

  const inserir = banco.prepare(
    'INSERT INTO tarefas (usuario_id, titulo, descricao, icone) VALUES (?, ?, ?, ?)'
  )
  const resultado = inserir.run(usuario_id, titulo.trim(), descricao || null, icone || '✓')

  res.status(201).json({
    sucesso: true,
    mensagem: 'Tarefa criada com sucesso!',
    tarefa: {
      id: resultado.lastInsertRowid,
      usuario_id,
      titulo: titulo.trim(),
      descricao: descricao || null,
      icone: icone || '✓',
      concluido: 0,
      data_criacao: new Date().toISOString(),
      data_conclusao: null
    }
  })
}

// Listar tarefas do usuário
function listarTarefas(req, res) {
  const usuario_id = req.params.usuario_id
  const { filtro } = req.query // 'todas', 'pendentes', 'concluidas'

  let sql = 'SELECT * FROM tarefas WHERE usuario_id = ?'
  const parametros = [usuario_id]

  if (filtro === 'pendentes') {
    sql += ' AND concluido = 0'
  } else if (filtro === 'concluidas') {
    sql += ' AND concluido = 1'
  }

  sql += ' ORDER BY data_criacao DESC'

  const tarefas = banco.prepare(sql).all(...parametros)

  res.json({ sucesso: true, dados: tarefas, total: tarefas.length })
}

// Obter tarefa por ID
function obterTarefa(req, res) {
  const { id } = req.params

  const tarefa = banco.prepare('SELECT * FROM tarefas WHERE id = ?').get(id)
  if (!tarefa) {
    return res.status(404).json({ sucesso: false, mensagem: 'Tarefa não encontrada.' })
  }

  res.json({ sucesso: true, dados: tarefa })
}

// Marcar tarefa como concluída/pendente (toggle checkbox)
function alternarTarefa(req, res) {
  const { id } = req.params

  const tarefa = banco.prepare('SELECT * FROM tarefas WHERE id = ?').get(id)
  if (!tarefa) {
    return res.status(404).json({ sucesso: false, mensagem: 'Tarefa não encontrada.' })
  }

  const novoStatus = tarefa.concluido ? 0 : 1
  const dataConclusao = novoStatus ? new Date().toISOString() : null

  banco.prepare('UPDATE tarefas SET concluido = ?, data_conclusao = ? WHERE id = ?')
    .run(novoStatus, dataConclusao, id)

  res.json({
    sucesso: true,
    mensagem: novoStatus ? 'Tarefa concluída!' : 'Tarefa reaberida!',
    tarefa: {
      id,
      concluido: novoStatus,
      data_conclusao: dataConclusao
    }
  })
}

// Atualizar tarefa
function atualizarTarefa(req, res) {
  const { id } = req.params
  const { titulo, descricao, icone } = req.body

  if (titulo !== undefined && (typeof titulo !== 'string' || !titulo.trim() || titulo.trim().length > 200)) {
    return res.status(422).json({ sucesso: false, mensagem: 'O título deve ter entre 1 e 200 caracteres.' })
  }
  if (descricao !== undefined && descricao !== null && typeof descricao !== 'string') {
    return res.status(422).json({ sucesso: false, mensagem: 'A descrição deve ser um texto.' })
  }
  if (icone !== undefined && (typeof icone !== 'string' || icone.length > 10)) {
    return res.status(422).json({ sucesso: false, mensagem: 'Ícone inválido.' })
  }

  const tarefa = banco.prepare('SELECT * FROM tarefas WHERE id = ?').get(id)
  if (!tarefa) {
    return res.status(404).json({ sucesso: false, mensagem: 'Tarefa não encontrada.' })
  }

  banco.prepare('UPDATE tarefas SET titulo = ?, descricao = ?, icone = ? WHERE id = ?')
    .run(titulo?.trim() || tarefa.titulo, descricao !== undefined ? descricao : tarefa.descricao, icone || tarefa.icone, id)

  res.json({
    sucesso: true,
    mensagem: 'Tarefa atualizada com sucesso!',
    tarefa: { id, titulo: titulo?.trim() || tarefa.titulo, descricao: descricao !== undefined ? descricao : tarefa.descricao, icone: icone || tarefa.icone }
  })
}

// Remover tarefa
function removerTarefa(req, res) {
  const { id } = req.params

  const tarefa = banco.prepare('SELECT * FROM tarefas WHERE id = ?').get(id)
  if (!tarefa) {
    return res.status(404).json({ sucesso: false, mensagem: 'Tarefa não encontrada.' })
  }

  banco.prepare('DELETE FROM tarefas WHERE id = ?').run(id)
  res.json({ sucesso: true, mensagem: 'Tarefa removida com sucesso!' })
}

// Contar tarefas pendentes
function contarPendentes(req, res) {
  const usuario_id = req.params.usuario_id
  const resultado = banco.prepare(
    'SELECT COUNT(*) AS total FROM tarefas WHERE usuario_id = ? AND concluido = 0'
  ).get(usuario_id)

  res.json({ sucesso: true, total: resultado.total })
}

// Obter tarefas de hoje
function obterTarefasHoje(req, res) {
  const usuario_id = req.params.usuario_id
  const hoje = new Date().toISOString().split('T')[0]

  const tarefas = banco.prepare(
    `SELECT * FROM tarefas 
     WHERE usuario_id = ? 
     AND DATE(data_criacao) = ? 
     ORDER BY concluido ASC, data_criacao DESC`
  ).all(usuario_id, hoje)

  res.json({
    sucesso: true,
    dados: tarefas,
    resumo: {
      total: tarefas.length,
      concluidas: tarefas.filter(t => t.concluido === 1).length,
      pendentes: tarefas.filter(t => t.concluido === 0).length
    }
  })
}

module.exports = {
  criarTarefa,
  listarTarefas,
  obterTarefa,
  alternarTarefa,
  atualizarTarefa,
  removerTarefa,
  contarPendentes,
  obterTarefasHoje
}
