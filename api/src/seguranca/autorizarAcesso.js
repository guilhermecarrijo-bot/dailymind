const banco = require('../config/conexaoBanco')

const tabelasPorRecurso = {
  humor: 'humor',
  sono: 'sono',
  energia: 'energia',
  lembretes: 'lembretes',
  tarefas: 'tarefas',
  metas: 'metas'
}

function negarAcesso(res) {
  return res.status(403).json({ sucesso: false, mensagem: 'Você não tem acesso a estes dados.' })
}

function autorizarAcesso(req, res, next) {
  const usuarioId = String(req.usuario.id)
  const partes = req.path.split('/').filter(Boolean)

  if (partes[0] === 'usuarios' && partes.length === 2 && req.method === 'GET' && partes[1] !== 'sessao' && partes[1] !== usuarioId) {
    return negarAcesso(res)
  }

  const idEnviado = req.body?.usuario_id ?? req.body?.id_usuario ?? req.query?.usuario_id ?? req.query?.id_usuario
  if (idEnviado !== undefined && idEnviado !== null && String(idEnviado) !== usuarioId) {
    return negarAcesso(res)
  }

  req.body = req.body && typeof req.body === 'object' ? req.body : {}
  req.body.usuario_id = req.usuario.id
  req.body.id_usuario = req.usuario.id
  if (partes[0] === 'usuarios' && partes[1] === 'perfil') {
    req.body.id = req.usuario.id
  }

  const recurso = tabelasPorRecurso[partes[0]]
  if (partes[0] === 'sugestoes' && partes.length === 2 && partes[1] !== usuarioId) {
    return negarAcesso(res)
  }

  const sufixosDeColecao = ['hoje', 'pendentes', 'ativas', 'estatisticas']
  const caminhoDeColecao = recurso && partes.length >= 2 && (
    sufixosDeColecao.includes(partes[2]) || (req.method === 'GET' && partes.length === 2)
  )

  if (caminhoDeColecao && partes[1] !== usuarioId) {
    return negarAcesso(res)
  }

  const eItem = recurso && partes.length >= 2 && !caminhoDeColecao && ['GET', 'PUT', 'DELETE'].includes(req.method)
  if (eItem) {
    const registro = banco.prepare(`SELECT usuario_id FROM ${recurso} WHERE id = ?`).get(partes[1])
    if (!registro || String(registro.usuario_id) !== usuarioId) {
      return negarAcesso(res)
    }
  }

  return next()
}

module.exports = autorizarAcesso