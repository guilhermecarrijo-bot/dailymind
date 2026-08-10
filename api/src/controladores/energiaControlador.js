const banco = require('../config/conexaoBanco')

// Registrar nível de energia
function registrarEnergia(req, res) {
  const { usuario_id, nivel_energia } = req.body

  if (!usuario_id || nivel_energia === undefined) {
    return res.status(422).json({ sucesso: false, mensagem: 'Usuário e nível de energia são obrigatórios.' })
  }

  if (nivel_energia < 1 || nivel_energia > 10) {
    return res.status(422).json({ sucesso: false, mensagem: 'Nível de energia deve ser entre 1 e 10.' })
  }

  const hoje = new Date().toISOString().split('T')[0]
  const existente = banco.prepare(
    'SELECT id FROM energia WHERE usuario_id = ? AND data_registro = ?'
  ).get(usuario_id, hoje)

  if (existente) {
    banco.prepare('UPDATE energia SET nivel_energia = ? WHERE id = ?')
      .run(nivel_energia, existente.id)
    return res.json({ sucesso: true, mensagem: 'Energia atualizada!' })
  }

  const inserir = banco.prepare('INSERT INTO energia (usuario_id, nivel_energia) VALUES (?, ?)')
  const resultado = inserir.run(usuario_id, nivel_energia)

  res.status(201).json({ sucesso: true, mensagem: 'Energia registrada!', id: resultado.lastInsertRowid })
}

// Listar energia do usuário
function listarEnergia(req, res) {
  const usuario_id = req.params.usuario_id
  const registros = banco.prepare(
    'SELECT * FROM energia WHERE usuario_id = ? ORDER BY data_registro DESC LIMIT 30'
  ).all(usuario_id)

  res.json({ sucesso: true, dados: registros })
}

// Obter energia de hoje
function obterEnergiaHoje(req, res) {
  const usuario_id = req.params.usuario_id
  const hoje = new Date().toISOString().split('T')[0]

  const registro = banco.prepare(
    'SELECT * FROM energia WHERE usuario_id = ? AND data_registro = ?'
  ).get(usuario_id, hoje)

  res.json({ sucesso: true, dado: registro || null })
}

module.exports = { registrarEnergia, listarEnergia, obterEnergiaHoje }
