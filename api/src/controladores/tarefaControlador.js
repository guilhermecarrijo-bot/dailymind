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

function alternarTarefa(req, res) {
  const { id } = req.params

  const tarefa = banco.prepare('SELECT * FROM TAREFA WHERE id_tarefa = ?').get(id)
  if (!tarefa) {
    return res.status(404).json({ sucesso: false, mensagem: 'Tarefa não encontrada.' })
  }

  const novoStatus = tarefa.concluida ? 0 : 1
  banco.prepare('UPDATE TAREFA SET concluida = ? WHERE id_tarefa = ?').run(novoStatus, id)

  res.json({ sucesso: true, mensagem: novoStatus ? 'Tarefa concluída!' : 'Tarefa reaberta!' })
}

function removerTarefa(req, res) {
  const { id } = req.params

  const tarefa = banco.prepare('SELECT * FROM TAREFA WHERE id_tarefa = ?').get(id)
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

module.exports = { criarTarefa, listarTarefas, alternarTarefa, removerTarefa, contarPendentes }
