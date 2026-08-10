const banco = require('../config/conexaoBanco')

// Criar lembrete
function criarLembrete(req, res) {
  const { usuario_id, titulo, icone, horario } = req.body

  if (!usuario_id || !titulo) {
    return res.status(422).json({ sucesso: false, mensagem: 'Usuário e título são obrigatórios.' })
  }

  const inserir = banco.prepare(
    'INSERT INTO lembretes (usuario_id, titulo, icone, horario) VALUES (?, ?, ?, ?)'
  )
  const resultado = inserir.run(usuario_id, titulo, icone || '📌', horario || null)

  res.status(201).json({
    sucesso: true,
    mensagem: 'Lembrete criado!',
    lembrete: { id: resultado.lastInsertRowid, titulo, icone: icone || '📌', horario, concluido: 0 }
  })
}

// Listar lembretes do usuário
function listarLembretes(req, res) {
  const usuario_id = req.params.usuario_id
  const lembretes = banco.prepare(
    'SELECT * FROM lembretes WHERE usuario_id = ? ORDER BY horario ASC'
  ).all(usuario_id)

  res.json({ sucesso: true, dados: lembretes })
}

// Marcar lembrete como concluído/pendente
function alternarLembrete(req, res) {
  const { id } = req.params

  const lembrete = banco.prepare('SELECT * FROM lembretes WHERE id = ?').get(id)
  if (!lembrete) {
    return res.status(404).json({ sucesso: false, mensagem: 'Lembrete não encontrado.' })
  }

  const novoStatus = lembrete.concluido ? 0 : 1
  banco.prepare('UPDATE lembretes SET concluido = ? WHERE id = ?').run(novoStatus, id)

  res.json({ sucesso: true, mensagem: novoStatus ? 'Lembrete concluído!' : 'Lembrete reaberto!' })
}

// Remover lembrete
function removerLembrete(req, res) {
  const { id } = req.params

  const lembrete = banco.prepare('SELECT * FROM lembretes WHERE id = ?').get(id)
  if (!lembrete) {
    return res.status(404).json({ sucesso: false, mensagem: 'Lembrete não encontrado.' })
  }

  banco.prepare('DELETE FROM lembretes WHERE id = ?').run(id)
  res.json({ sucesso: true, mensagem: 'Lembrete removido!' })
}

// Contar lembretes pendentes
function contarPendentes(req, res) {
  const usuario_id = req.params.usuario_id
  const resultado = banco.prepare(
    'SELECT COUNT(*) AS total FROM lembretes WHERE usuario_id = ? AND concluido = 0'
  ).get(usuario_id)

  res.json({ sucesso: true, total: resultado.total })
}

module.exports = { criarLembrete, listarLembretes, alternarLembrete, removerLembrete, contarPendentes }
