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

function consultarMeta(req, res) {
  const meta = banco.prepare('SELECT * FROM META WHERE id_meta = ? AND id_usuario = ?')
    .get(req.params.id, req.params.id_usuario)

  if (!meta) {
    return res.status(404).json({ sucesso: false, mensagem: 'Meta não encontrada.' })
  }

  res.json({ sucesso: true, meta })
}

function editarMeta(req, res) {
  const { id_usuario, titulo, descricao, data_inicio, data_fim, concluida } = req.body
  if (!id_usuario) {
    return res.status(422).json({ sucesso: false, mensagem: 'ID do usuário é obrigatório.' })
  }

  const meta = banco.prepare('SELECT id_meta FROM META WHERE id_meta = ? AND id_usuario = ?')
    .get(req.params.id, id_usuario)
  if (!meta) {
    return res.status(404).json({ sucesso: false, mensagem: 'Meta não encontrada.' })
  }

  banco.prepare(`UPDATE META SET
    titulo = COALESCE(?, titulo), descricao = COALESCE(?, descricao),
    data_inicio = COALESCE(?, data_inicio), data_fim = COALESCE(?, data_fim),
    concluida = COALESCE(?, concluida)
    WHERE id_meta = ? AND id_usuario = ?`).run(
    titulo || null, descricao ?? null, data_inicio ?? null, data_fim ?? null,
    concluida === undefined ? null : (concluida ? 1 : 0), req.params.id, id_usuario
  )

  const atualizada = banco.prepare('SELECT * FROM META WHERE id_meta = ?').get(req.params.id)
  res.json({ sucesso: true, mensagem: 'Meta atualizada!', meta: atualizada })
}

function alternarMeta(req, res) {
  const { id } = req.params
  const id_usuario = req.body.id_usuario || req.query.id_usuario

  const meta = banco.prepare('SELECT * FROM META WHERE id_meta = ? AND id_usuario = ?').get(id, id_usuario)
  if (!meta) {
    return res.status(404).json({ sucesso: false, mensagem: 'Meta não encontrada.' })
  }

  const novoStatus = meta.concluida ? 0 : 1
  banco.prepare('UPDATE META SET concluida = ? WHERE id_meta = ?').run(novoStatus, id)

  res.json({ sucesso: true, mensagem: novoStatus ? 'Meta concluída!' : 'Meta reaberta!' })
}

function removerMeta(req, res) {
  const { id } = req.params
  const id_usuario = req.body.id_usuario || req.query.id_usuario

  const meta = banco.prepare('SELECT * FROM META WHERE id_meta = ? AND id_usuario = ?').get(id, id_usuario)
  if (!meta) {
    return res.status(404).json({ sucesso: false, mensagem: 'Meta não encontrada.' })
  }

  banco.prepare('DELETE FROM META WHERE id_meta = ?').run(id)
  res.json({ sucesso: true, mensagem: 'Meta removida!' })
}

module.exports = { criarMeta, listarMetas, consultarMeta, editarMeta, alternarMeta, removerMeta }
