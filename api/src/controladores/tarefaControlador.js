const banco = require('../config/conexaoBanco')

function criarTarefa(req, res) {
  const { id_usuario, titulo, descricao, data, horario, categoria } = req.body

  if (!id_usuario || !titulo) {
    return res.status(422).json({ sucesso: false, mensagem: 'Usuário e título são obrigatórios.' })
  }

  const inserir = banco.prepare(
    'INSERT INTO TAREFA (id_usuario, titulo, descricao, data, horario, categoria) VALUES (?, ?, ?, ?, ?, ?)'
  )
  const resultado = inserir.run(id_usuario, titulo, descricao || null, data || null, horario || null, categoria || null)

  res.status(201).json({
    sucesso: true,
    mensagem: 'Tarefa criada!',
    tarefa: { id_tarefa: resultado.lastInsertRowid, titulo, descricao, data, horario, categoria, concluida: 0 }
  })
}

function listarTarefas(req, res) {
  const id_usuario = req.params.id_usuario
  const tarefas = banco.prepare(
    'SELECT * FROM TAREFA WHERE id_usuario = ? ORDER BY data ASC, horario ASC'
  ).all(id_usuario)

  res.json({ sucesso: true, dados: tarefas })
}

function consultarTarefa(req, res) {
  const tarefa = banco.prepare('SELECT * FROM TAREFA WHERE id_tarefa = ? AND id_usuario = ?')
    .get(req.params.id, req.params.id_usuario)

  if (!tarefa) {
    return res.status(404).json({ sucesso: false, mensagem: 'Tarefa não encontrada.' })
  }

  res.json({ sucesso: true, tarefa })
}

function editarTarefa(req, res) {
  const { id_usuario, titulo, descricao, data, horario, categoria, concluida } = req.body
  if (!id_usuario) {
    return res.status(422).json({ sucesso: false, mensagem: 'ID do usuário é obrigatório.' })
  }

  const tarefa = banco.prepare('SELECT id_tarefa FROM TAREFA WHERE id_tarefa = ? AND id_usuario = ?')
    .get(req.params.id, id_usuario)
  if (!tarefa) {
    return res.status(404).json({ sucesso: false, mensagem: 'Tarefa não encontrada.' })
  }

  banco.prepare(`UPDATE TAREFA SET
    titulo = COALESCE(?, titulo), descricao = COALESCE(?, descricao), data = COALESCE(?, data),
    horario = COALESCE(?, horario), categoria = COALESCE(?, categoria), concluida = COALESCE(?, concluida)
    WHERE id_tarefa = ? AND id_usuario = ?`).run(
    titulo || null, descricao ?? null, data ?? null, horario ?? null, categoria ?? null,
    concluida === undefined ? null : (concluida ? 1 : 0), req.params.id, id_usuario
  )

  const atualizada = banco.prepare('SELECT * FROM TAREFA WHERE id_tarefa = ?').get(req.params.id)
  res.json({ sucesso: true, mensagem: 'Tarefa atualizada!', tarefa: atualizada })
}

function alternarTarefa(req, res) {
  const { id } = req.params
  const id_usuario = req.body.id_usuario || req.query.id_usuario

  const tarefa = banco.prepare('SELECT * FROM TAREFA WHERE id_tarefa = ? AND id_usuario = ?').get(id, id_usuario)
  if (!tarefa) {
    return res.status(404).json({ sucesso: false, mensagem: 'Tarefa não encontrada.' })
  }

  const novoStatus = tarefa.concluida ? 0 : 1
  banco.prepare('UPDATE TAREFA SET concluida = ? WHERE id_tarefa = ?').run(novoStatus, id)

  res.json({ sucesso: true, mensagem: novoStatus ? 'Tarefa concluída!' : 'Tarefa reaberta!' })
}

function removerTarefa(req, res) {
  const { id } = req.params
  const id_usuario = req.body.id_usuario || req.query.id_usuario

  const tarefa = banco.prepare('SELECT * FROM TAREFA WHERE id_tarefa = ? AND id_usuario = ?').get(id, id_usuario)
  if (!tarefa) {
    return res.status(404).json({ sucesso: false, mensagem: 'Tarefa não encontrada.' })
  }

  banco.prepare('DELETE FROM TAREFA WHERE id_tarefa = ?').run(id)
  res.json({ sucesso: true, mensagem: 'Tarefa removida!' })
}

function contarPendentes(req, res) {
  const id_usuario = req.params.id_usuario
  const resultado = banco.prepare(
    'SELECT COUNT(*) AS total FROM TAREFA WHERE id_usuario = ? AND concluida = 0'
  ).get(id_usuario)

  res.json({ sucesso: true, total: resultado.total })
}

module.exports = { criarTarefa, listarTarefas, consultarTarefa, editarTarefa, alternarTarefa, removerTarefa, contarPendentes }
