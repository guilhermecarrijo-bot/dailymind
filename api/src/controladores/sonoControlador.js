const banco = require('../config/conexaoBanco')

function registrarSono(req, res) {
  const { id_usuario, horas_dormidas, qualidade, observacao } = req.body

  if (!id_usuario || horas_dormidas === undefined) {
    return res.status(422).json({ sucesso: false, mensagem: 'Usuário e horas dormidas são obrigatórias.' })
  }

  if (horas_dormidas < 0 || horas_dormidas > 24) {
    return res.status(422).json({ sucesso: false, mensagem: 'Horas dormidas devem ser entre 0 e 24.' })
  }

  const qual = qualidade || 5
  if (qual < 1 || qual > 5) {
    return res.status(422).json({ sucesso: false, mensagem: 'Qualidade deve ser entre 1 e 5.' })
  }

  const hoje = new Date().toISOString().split('T')[0]
  const existente = banco.prepare(
    'SELECT id_sono FROM SONO WHERE id_usuario = ? AND data = ?'
  ).get(id_usuario, hoje)

  if (existente) {
    banco.prepare('UPDATE SONO SET horas_dormidas = ?, qualidade = ?, observacao = ? WHERE id_sono = ?')
      .run(horas_dormidas, qual, observacao || null, existente.id_sono)
    return res.json({ sucesso: true, mensagem: 'Sono atualizado!' })
  }

  const inserir = banco.prepare('INSERT INTO SONO (id_usuario, horas_dormidas, qualidade, observacao) VALUES (?, ?, ?, ?)')
  const resultado = inserir.run(id_usuario, horas_dormidas, qual, observacao || null)

  res.status(201).json({ sucesso: true, mensagem: 'Sono registrado!', id_sono: resultado.lastInsertRowid })
}

function listarSono(req, res) {
  const id_usuario = req.params.id_usuario
  const registros = banco.prepare(
    'SELECT * FROM SONO WHERE id_usuario = ? ORDER BY data DESC LIMIT 30'
  ).all(id_usuario)

  res.json({ sucesso: true, dados: registros })
}

function editarSono(req, res) {
  const { id_usuario, horas_dormidas, qualidade, observacao, data } = req.body
  if (!id_usuario || horas_dormidas === undefined) {
    return res.status(422).json({ sucesso: false, mensagem: 'Usuário e horas dormidas são obrigatórias.' })
  }
  if (horas_dormidas < 0 || horas_dormidas > 24) {
    return res.status(422).json({ sucesso: false, mensagem: 'Horas dormidas devem ser entre 0 e 24.' })
  }
  if (qualidade !== undefined && (qualidade < 1 || qualidade > 5)) {
    return res.status(422).json({ sucesso: false, mensagem: 'Qualidade deve ser entre 1 e 5.' })
  }

  const resultado = banco.prepare(`UPDATE SONO SET horas_dormidas = ?, qualidade = COALESCE(?, qualidade),
    observacao = ?, data = COALESCE(?, data) WHERE id_sono = ? AND id_usuario = ?`).run(
    horas_dormidas, qualidade ?? null, observacao ?? null, data ?? null, req.params.id, id_usuario
  )
  if (!resultado.changes) {
    return res.status(404).json({ sucesso: false, mensagem: 'Registro de sono não encontrado.' })
  }

  const registro = banco.prepare('SELECT * FROM SONO WHERE id_sono = ?').get(req.params.id)
  res.json({ sucesso: true, mensagem: 'Sono atualizado!', sono: registro })
}

function removerSono(req, res) {
  const id_usuario = req.body.id_usuario || req.query.id_usuario
  const resultado = banco.prepare('DELETE FROM SONO WHERE id_sono = ? AND id_usuario = ?')
    .run(req.params.id, id_usuario)
  if (!resultado.changes) {
    return res.status(404).json({ sucesso: false, mensagem: 'Registro de sono não encontrado.' })
  }
  res.json({ sucesso: true, mensagem: 'Sono removido!' })
}

function obterSonoHoje(req, res) {
  const id_usuario = req.params.id_usuario
  const hoje = new Date().toISOString().split('T')[0]

  const registro = banco.prepare(
    'SELECT * FROM SONO WHERE id_usuario = ? AND data = ?'
  ).get(id_usuario, hoje)

  res.json({ sucesso: true, dado: registro || null })
}

module.exports = { registrarSono, listarSono, obterSonoHoje, editarSono, removerSono }
