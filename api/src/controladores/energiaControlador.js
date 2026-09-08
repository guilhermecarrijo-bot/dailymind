const banco = require('../config/conexaoBanco')

function registrarEnergia(req, res) {
  const usuarioId = req.body.usuario_id || req.body.id_usuario
  const nivel = req.body.nivel_energia ?? req.body.nivel

  if (!usuarioId || nivel === undefined) {
    return res.status(422).json({ sucesso: false, mensagem: 'Usuário e nível de energia são obrigatórios.' })
  }

  if (nivel < 1 || nivel > 10) {
    return res.status(422).json({ sucesso: false, mensagem: 'Nível de energia deve ser entre 1 e 10.' })
  }

  const hoje = new Date().toISOString().split('T')[0]
  const existente = banco.prepare(
    'SELECT id FROM energia WHERE usuario_id = ? AND data_registro = ?'
  ).get(usuarioId, hoje)

  if (existente) {
    banco.prepare('UPDATE energia SET nivel_energia = ? WHERE id = ?').run(nivel, existente.id)
    return res.json({ sucesso: true, mensagem: 'Energia atualizada!' })
  }

  const inserir = banco.prepare('INSERT INTO energia (usuario_id, nivel_energia, data_registro) VALUES (?, ?, ?)')
  const resultado = inserir.run(usuarioId, nivel, hoje)

  res.status(201).json({ sucesso: true, mensagem: 'Energia registrada!', id_energia: resultado.lastInsertRowid })
}

function listarEnergia(req, res) {
  const usuarioId = req.params.usuario_id || req.params.id_usuario
  const registros = banco.prepare(
    'SELECT * FROM energia WHERE usuario_id = ? ORDER BY data_registro DESC LIMIT 30'
  ).all(usuarioId)

  res.json({ sucesso: true, dados: registros })
}

function editarEnergia(req, res) {
  const usuarioId = req.body.usuario_id || req.body.id_usuario
  const nivel = req.body.nivel_energia ?? req.body.nivel

  if (!usuarioId || nivel === undefined) {
    return res.status(422).json({ sucesso: false, mensagem: 'Usuário e nível de energia são obrigatórios.' })
  }

  const resultado = banco.prepare('UPDATE energia SET nivel_energia = ? WHERE id = ? AND usuario_id = ?').run(nivel, req.params.id, usuarioId)
  if (!resultado.changes) {
    return res.status(404).json({ sucesso: false, mensagem: 'Registro de energia não encontrado.' })
  }

  const registro = banco.prepare('SELECT * FROM energia WHERE id = ?').get(req.params.id)
  res.json({ sucesso: true, mensagem: 'Energia atualizada!', energia: registro })
}

function removerEnergia(req, res) {
  const usuarioId = req.body.usuario_id || req.body.id_usuario || req.query.usuario_id || req.query.id_usuario
  const resultado = banco.prepare('DELETE FROM energia WHERE id = ? AND usuario_id = ?').run(req.params.id, usuarioId)
  if (!resultado.changes) {
    return res.status(404).json({ sucesso: false, mensagem: 'Registro de energia não encontrado.' })
  }
  res.json({ sucesso: true, mensagem: 'Energia removida!' })
}

function obterEnergiaHoje(req, res) {
  const usuarioId = req.params.usuario_id || req.params.id_usuario
  const hoje = new Date().toISOString().split('T')[0]

  const registro = banco.prepare(
    'SELECT * FROM energia WHERE usuario_id = ? AND data_registro = ?'
  ).get(usuarioId, hoje)

  res.json({ sucesso: true, dado: registro || null })
}

module.exports = { registrarEnergia, listarEnergia, obterEnergiaHoje, editarEnergia, removerEnergia }
