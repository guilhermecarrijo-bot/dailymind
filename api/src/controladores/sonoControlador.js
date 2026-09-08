const banco = require('../config/conexaoBanco')

function registrarSono(req, res) {
  const usuarioId = req.body.usuario_id || req.body.id_usuario
  const horasSono = req.body.horas_sono ?? req.body.horas_dormidas
  const qualidade = req.body.qualidade ?? 5

  if (!usuarioId || horasSono === undefined) {
    return res.status(422).json({ sucesso: false, mensagem: 'Usuário e horas de sono são obrigatórios.' })
  }

  if (horasSono < 0 || horasSono > 24) {
    return res.status(422).json({ sucesso: false, mensagem: 'Horas de sono devem ser entre 0 e 24.' })
  }

  if (qualidade < 1 || qualidade > 5) {
    return res.status(422).json({ sucesso: false, mensagem: 'Qualidade deve ser entre 1 e 5.' })
  }

  const hoje = new Date().toISOString().split('T')[0]
  const existente = banco.prepare(
    'SELECT id FROM sono WHERE usuario_id = ? AND data_registro = ?'
  ).get(usuarioId, hoje)

  if (existente) {
    banco.prepare('UPDATE sono SET horas_sono = ?, qualidade = ? WHERE id = ?').run(horasSono, qualidade, existente.id)
    return res.json({ sucesso: true, mensagem: 'Sono atualizado!' })
  }

  const inserir = banco.prepare('INSERT INTO sono (usuario_id, horas_sono, qualidade, data_registro) VALUES (?, ?, ?, ?)')
  const resultado = inserir.run(usuarioId, horasSono, qualidade, hoje)

  res.status(201).json({ sucesso: true, mensagem: 'Sono registrado!', id_sono: resultado.lastInsertRowid })
}

function listarSono(req, res) {
  const usuarioId = req.params.usuario_id || req.params.id_usuario
  const registros = banco.prepare(
    'SELECT * FROM sono WHERE usuario_id = ? ORDER BY data_registro DESC LIMIT 30'
  ).all(usuarioId)

  res.json({ sucesso: true, dados: registros })
}

function editarSono(req, res) {
  const usuarioId = req.body.usuario_id || req.body.id_usuario
  const horasSono = req.body.horas_sono ?? req.body.horas_dormidas
  const qualidade = req.body.qualidade ?? 5

  if (!usuarioId || horasSono === undefined) {
    return res.status(422).json({ sucesso: false, mensagem: 'Usuário e horas de sono são obrigatórios.' })
  }

  const resultado = banco.prepare('UPDATE sono SET horas_sono = ?, qualidade = ? WHERE id = ? AND usuario_id = ?')
    .run(horasSono, qualidade, req.params.id, usuarioId)

  if (!resultado.changes) {
    return res.status(404).json({ sucesso: false, mensagem: 'Registro de sono não encontrado.' })
  }

  const registro = banco.prepare('SELECT * FROM sono WHERE id = ?').get(req.params.id)
  res.json({ sucesso: true, mensagem: 'Sono atualizado!', sono: registro })
}

function removerSono(req, res) {
  const usuarioId = req.body.usuario_id || req.body.id_usuario || req.query.usuario_id || req.query.id_usuario
  const resultado = banco.prepare('DELETE FROM sono WHERE id = ? AND usuario_id = ?').run(req.params.id, usuarioId)
  if (!resultado.changes) {
    return res.status(404).json({ sucesso: false, mensagem: 'Registro de sono não encontrado.' })
  }
  res.json({ sucesso: true, mensagem: 'Sono removido!' })
}

function obterSonoHoje(req, res) {
  const usuarioId = req.params.usuario_id || req.params.id_usuario
  const hoje = new Date().toISOString().split('T')[0]

  const registro = banco.prepare(
    'SELECT * FROM sono WHERE usuario_id = ? AND data_registro = ?'
  ).get(usuarioId, hoje)

  res.json({ sucesso: true, dado: registro || null })
}

module.exports = { registrarSono, listarSono, obterSonoHoje, editarSono, removerSono }
