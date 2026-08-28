const banco = require('../config/conexaoBanco')

function registrarHumor(req, res) {
  const { id_usuario, humor, intensidade, observacao } = req.body

  if (!id_usuario || !humor || !intensidade) {
    return res.status(422).json({ sucesso: false, mensagem: 'Usuário, humor e intensidade são obrigatórios.' })
  }

  if (intensidade < 1 || intensidade > 5) {
    return res.status(422).json({ sucesso: false, mensagem: 'Intensidade deve ser entre 1 e 5.' })
  }

  const hoje = new Date().toISOString().split('T')[0]
  const existente = banco.prepare(
    'SELECT id_humor FROM HUMOR WHERE id_usuario = ? AND data = ?'
  ).get(id_usuario, hoje)

  if (existente) {
    banco.prepare('UPDATE HUMOR SET humor = ?, intensidade = ?, observacao = ? WHERE id_humor = ?')
      .run(humor, intensidade, observacao || null, existente.id_humor)
    return res.json({ sucesso: true, mensagem: 'Humor atualizado!' })
  }

  const inserir = banco.prepare('INSERT INTO HUMOR (id_usuario, humor, intensidade, observacao) VALUES (?, ?, ?, ?)')
  const resultado = inserir.run(id_usuario, humor, intensidade, observacao || null)

  res.status(201).json({ sucesso: true, mensagem: 'Humor registrado!', id_humor: resultado.lastInsertRowid })
}

function listarHumor(req, res) {
  const id_usuario = req.params.id_usuario
  const registros = banco.prepare(
    'SELECT * FROM HUMOR WHERE id_usuario = ? ORDER BY data DESC LIMIT 30'
  ).all(id_usuario)

  res.json({ sucesso: true, dados: registros })
}

function editarHumor(req, res) {
  const { id_usuario, humor, intensidade, observacao, data } = req.body
  if (!id_usuario || !humor || intensidade === undefined) {
    return res.status(422).json({ sucesso: false, mensagem: 'Usuário, humor e intensidade são obrigatórios.' })
  }
  if (intensidade < 1 || intensidade > 5) {
    return res.status(422).json({ sucesso: false, mensagem: 'Intensidade deve ser entre 1 e 5.' })
  }

  const resultado = banco.prepare(`UPDATE HUMOR SET humor = ?, intensidade = ?, observacao = ?, data = COALESCE(?, data)
    WHERE id_humor = ? AND id_usuario = ?`).run(
    humor, intensidade, observacao ?? null, data ?? null, req.params.id, id_usuario
  )
  if (!resultado.changes) {
    return res.status(404).json({ sucesso: false, mensagem: 'Registro de humor não encontrado.' })
  }

  const registro = banco.prepare('SELECT * FROM HUMOR WHERE id_humor = ?').get(req.params.id)
  res.json({ sucesso: true, mensagem: 'Humor atualizado!', humor: registro })
}

function removerHumor(req, res) {
  const id_usuario = req.body.id_usuario || req.query.id_usuario
  const resultado = banco.prepare('DELETE FROM HUMOR WHERE id_humor = ? AND id_usuario = ?')
    .run(req.params.id, id_usuario)
  if (!resultado.changes) {
    return res.status(404).json({ sucesso: false, mensagem: 'Registro de humor não encontrado.' })
  }
  res.json({ sucesso: true, mensagem: 'Humor removido!' })
}

function obterHumorHoje(req, res) {
  const id_usuario = req.params.id_usuario
  const hoje = new Date().toISOString().split('T')[0]

  const registro = banco.prepare(
    'SELECT * FROM HUMOR WHERE id_usuario = ? AND data = ?'
  ).get(id_usuario, hoje)

  res.json({ sucesso: true, dado: registro || null })
}

module.exports = { registrarHumor, listarHumor, obterHumorHoje, editarHumor, removerHumor }
