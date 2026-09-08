const banco = require('../config/conexaoBanco')

function registrarHumor(req, res) {
  const usuarioId = req.body.usuario_id || req.body.id_usuario
  const emoji = req.body.emoji || req.body.humor

  if (!usuarioId || !emoji) {
    return res.status(422).json({ sucesso: false, mensagem: 'Usuário e humor são obrigatórios.' })
  }

  const hoje = new Date().toISOString().split('T')[0]
  const existente = banco.prepare(
    'SELECT id FROM humor WHERE usuario_id = ? AND data_registro = ?'
  ).get(usuarioId, hoje)

  if (existente) {
    banco.prepare('UPDATE humor SET emoji = ? WHERE id = ?').run(emoji, existente.id)
    return res.json({ sucesso: true, mensagem: 'Humor atualizado!' })
  }

  const inserir = banco.prepare('INSERT INTO humor (usuario_id, emoji, data_registro) VALUES (?, ?, ?)')
  const resultado = inserir.run(usuarioId, emoji, hoje)

  res.status(201).json({ sucesso: true, mensagem: 'Humor registrado!', id_humor: resultado.lastInsertRowid })
}

function listarHumor(req, res) {
  const usuarioId = req.params.usuario_id || req.params.id_usuario
  const registros = banco.prepare(
    'SELECT * FROM humor WHERE usuario_id = ? ORDER BY data_registro DESC LIMIT 30'
  ).all(usuarioId)

  res.json({ sucesso: true, dados: registros })
}

function editarHumor(req, res) {
  const usuarioId = req.body.usuario_id || req.body.id_usuario
  const emoji = req.body.emoji || req.body.humor

  if (!usuarioId || !emoji) {
    return res.status(422).json({ sucesso: false, mensagem: 'Usuário e humor são obrigatórios.' })
  }

  const resultado = banco.prepare('UPDATE humor SET emoji = ? WHERE id = ? AND usuario_id = ?').run(emoji, req.params.id, usuarioId)
  if (!resultado.changes) {
    return res.status(404).json({ sucesso: false, mensagem: 'Registro de humor não encontrado.' })
  }

  const registro = banco.prepare('SELECT * FROM humor WHERE id = ?').get(req.params.id)
  res.json({ sucesso: true, mensagem: 'Humor atualizado!', humor: registro })
}

function removerHumor(req, res) {
  const usuarioId = req.body.usuario_id || req.query.usuario_id || req.body.id_usuario || req.query.id_usuario
  const resultado = banco.prepare('DELETE FROM humor WHERE id = ? AND usuario_id = ?').run(req.params.id, usuarioId)
  if (!resultado.changes) {
    return res.status(404).json({ sucesso: false, mensagem: 'Registro de humor não encontrado.' })
  }
  res.json({ sucesso: true, mensagem: 'Humor removido!' })
}

function obterHumorHoje(req, res) {
  const usuarioId = req.params.usuario_id || req.params.id_usuario
  const hoje = new Date().toISOString().split('T')[0]

  const registro = banco.prepare(
    'SELECT * FROM humor WHERE usuario_id = ? AND data_registro = ?'
  ).get(usuarioId, hoje)

  res.json({ sucesso: true, dado: registro || null })
}

module.exports = { registrarHumor, listarHumor, obterHumorHoje, editarHumor, removerHumor }
