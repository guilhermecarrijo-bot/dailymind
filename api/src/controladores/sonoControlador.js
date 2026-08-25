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

function obterSonoHoje(req, res) {
  const id_usuario = req.params.id_usuario
  const hoje = new Date().toISOString().split('T')[0]

  const registro = banco.prepare(
    'SELECT * FROM SONO WHERE id_usuario = ? AND data = ?'
  ).get(id_usuario, hoje)

  res.json({ sucesso: true, dado: registro || null })
}

module.exports = { registrarSono, listarSono, obterSonoHoje }
