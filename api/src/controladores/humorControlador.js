const banco = require('../config/conexaoBanco')

// Registrar humor diário
function registrarHumor(req, res) {
  const { usuario_id, emoji } = req.body

  if (!usuario_id || !emoji) {
    return res.status(422).json({ sucesso: false, mensagem: 'Usuário e emoji são obrigatórios.' })
  }

  const hoje = new Date().toISOString().split('T')[0]
  const existente = banco.prepare(
    'SELECT id FROM humor WHERE usuario_id = ? AND data_registro = ?'
  ).get(usuario_id, hoje)

  if (existente) {
    banco.prepare('UPDATE humor SET emoji = ? WHERE id = ?').run(emoji, existente.id)
    return res.json({ sucesso: true, mensagem: 'Humor atualizado!' })
  }

  const inserir = banco.prepare('INSERT INTO humor (usuario_id, emoji) VALUES (?, ?)')
  const resultado = inserir.run(usuario_id, emoji)

  res.status(201).json({ sucesso: true, mensagem: 'Humor registrado!', id: resultado.lastInsertRowid })
}

// Listar humor do usuário (últimos registros)
function listarHumor(req, res) {
  const usuario_id = req.params.usuario_id
  const registros = banco.prepare(
    'SELECT * FROM humor WHERE usuario_id = ? ORDER BY data_registro DESC LIMIT 30'
  ).all(usuario_id)

  res.json({ sucesso: true, dados: registros })
}

// Obter humor de hoje
function obterHumorHoje(req, res) {
  const usuario_id = req.params.usuario_id
  const hoje = new Date().toISOString().split('T')[0]

  const registro = banco.prepare(
    'SELECT * FROM humor WHERE usuario_id = ? AND data_registro = ?'
  ).get(usuario_id, hoje)

  res.json({ sucesso: true, dado: registro || null })
}

module.exports = { registrarHumor, listarHumor, obterHumorHoje }
