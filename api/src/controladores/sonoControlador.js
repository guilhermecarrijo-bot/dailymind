const banco = require('../config/conexaoBanco')

// Registrar sono diário
function registrarSono(req, res) {
  const { usuario_id, horas_sono, qualidade } = req.body

  if (!usuario_id || horas_sono === undefined) {
    return res.status(422).json({ sucesso: false, mensagem: 'Usuário e horas de sono são obrigatórios.' })
  }

  if (horas_sono < 0 || horas_sono > 24) {
    return res.status(422).json({ sucesso: false, mensagem: 'Horas de sono devem ser entre 0 e 24.' })
  }

  const hoje = new Date().toISOString().split('T')[0]
  const existente = banco.prepare(
    'SELECT id FROM sono WHERE usuario_id = ? AND data_registro = ?'
  ).get(usuario_id, hoje)

  if (existente) {
    banco.prepare('UPDATE sono SET horas_sono = ?, qualidade = ? WHERE id = ?')
      .run(horas_sono, qualidade || 5, existente.id)
    return res.json({ sucesso: true, mensagem: 'Sono atualizado!' })
  }

  const inserir = banco.prepare('INSERT INTO sono (usuario_id, horas_sono, qualidade) VALUES (?, ?, ?)')
  const resultado = inserir.run(usuario_id, horas_sono, qualidade || 5)

  res.status(201).json({ sucesso: true, mensagem: 'Sono registrado!', id: resultado.lastInsertRowid })
}

// Listar sono do usuário
function listarSono(req, res) {
  const usuario_id = req.params.usuario_id
  const registros = banco.prepare(
    'SELECT * FROM sono WHERE usuario_id = ? ORDER BY data_registro DESC LIMIT 30'
  ).all(usuario_id)

  res.json({ sucesso: true, dados: registros })
}

// Obter sono de hoje
function obterSonoHoje(req, res) {
  const usuario_id = req.params.usuario_id
  const hoje = new Date().toISOString().split('T')[0]

  const registro = banco.prepare(
    'SELECT * FROM sono WHERE usuario_id = ? AND data_registro = ?'
  ).get(usuario_id, hoje)

  res.json({ sucesso: true, dado: registro || null })
}

module.exports = { registrarSono, listarSono, obterSonoHoje }
