const banco = require('../config/conexaoBanco')

function registrarEnergia(req, res) {
  const { id_usuario, nivel, observacao } = req.body

  if (!id_usuario || nivel === undefined) {
    return res.status(422).json({ sucesso: false, mensagem: 'Usuário e nível de energia são obrigatórios.' })
  }

  if (nivel < 1 || nivel > 5) {
    return res.status(422).json({ sucesso: false, mensagem: 'Nível de energia deve ser entre 1 e 5.' })
  }

  const hoje = new Date().toISOString().split('T')[0]
  const existente = banco.prepare(
    'SELECT id_energia FROM ENERGIA WHERE id_usuario = ? AND data = ?'
  ).get(id_usuario, hoje)

  if (existente) {
    banco.prepare('UPDATE ENERGIA SET nivel = ?, observacao = ? WHERE id_energia = ?')
      .run(nivel, observacao || null, existente.id_energia)
    return res.json({ sucesso: true, mensagem: 'Energia atualizada!' })
  }

  const inserir = banco.prepare('INSERT INTO ENERGIA (id_usuario, nivel, observacao) VALUES (?, ?, ?)')
  const resultado = inserir.run(id_usuario, nivel, observacao || null)

  res.status(201).json({ sucesso: true, mensagem: 'Energia registrada!', id_energia: resultado.lastInsertRowid })
}

function listarEnergia(req, res) {
  const id_usuario = req.params.id_usuario
  const registros = banco.prepare(
    'SELECT * FROM ENERGIA WHERE id_usuario = ? ORDER BY data DESC LIMIT 30'
  ).all(id_usuario)

  res.json({ sucesso: true, dados: registros })
}

function obterEnergiaHoje(req, res) {
  const id_usuario = req.params.id_usuario
  const hoje = new Date().toISOString().split('T')[0]

  const registro = banco.prepare(
    'SELECT * FROM ENERGIA WHERE id_usuario = ? AND data = ?'
  ).get(id_usuario, hoje)

  res.json({ sucesso: true, dado: registro || null })
}

module.exports = { registrarEnergia, listarEnergia, obterEnergiaHoje }
