const banco = require('../config/conexaoBanco')

function criarMeta(req, res) {
  const { id_usuario, titulo, descricao, data_inicio, data_fim } = req.body

  if (!id_usuario || !titulo) {
    return res.status(422).json({ sucesso: false, mensagem: 'Usuário e título são obrigatórios.' })
  }

  const inserir = banco.prepare(
    'INSERT INTO META (id_usuario, titulo, descricao, data_inicio, data_fim) VALUES (?, ?, ?, ?, ?)'
  )
  const resultado = inserir.run(id_usuario, titulo, descricao || null, data_inicio || null, data_fim || null)

  res.status(201).json({
    sucesso: true,
    mensagem: 'Meta criada!',
    meta: { id_meta: resultado.lastInsertRowid, titulo, descricao, data_inicio, data_fim, concluida: 0 }
  })
}

function listarMetas(req, res) {
  const id_usuario = req.params.id_usuario
  const metas = banco.prepare(
    'SELECT * FROM META WHERE id_usuario = ? ORDER BY concluida ASC, data_inicio DESC'
  ).all(id_usuario)

  res.json({ sucesso: true, dados: metas })
}

function alternarMeta(req, res) {
  const { id } = req.params

  const meta = banco.prepare('SELECT * FROM META WHERE id_meta = ?').get(id)
  if (!meta) {
    return res.status(404).json({ sucesso: false, mensagem: 'Meta não encontrada.' })
  }

  const novoStatus = meta.concluida ? 0 : 1
  banco.prepare('UPDATE META SET concluida = ? WHERE id_meta = ?').run(novoStatus, id)

  res.json({ sucesso: true, mensagem: novoStatus ? 'Meta concluída!' : 'Meta reaberta!' })
}

function removerMeta(req, res) {
  const { id } = req.params

  const meta = banco.prepare('SELECT * FROM META WHERE id_meta = ?').get(id)
  if (!meta) {
    return res.status(404).json({ sucesso: false, mensagem: 'Meta não encontrada.' })
  }

  banco.prepare('DELETE FROM META WHERE id_meta = ?').run(id)
  res.json({ sucesso: true, mensagem: 'Meta removida!' })
}

module.exports = { criarMeta, listarMetas, alternarMeta, removerMeta }
