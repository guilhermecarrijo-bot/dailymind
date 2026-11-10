const { Router } = require('express')
const { exigirAutenticacao } = require('../seguranca/sessoes')
const {
  dashboardMetricas,
  listarUsuarios,
  atualizarStatusUsuario,
  excluirUsuario,
  relatorios
} = require('../controladores/adminControlador')

const rotas = Router()
const limitesPorIp = new Map()

function aplicarRateLimit(req, res, next) {
  const chave = req.ip || 'local'
  const agora = Date.now()
  const entradas = limitesPorIp.get(chave) || []
  const recentes = entradas.filter((tempo) => agora - tempo < 60_000)

  if (recentes.length >= 60) {
    return res.status(429).json({ sucesso: false, mensagem: 'Muitas tentativas em pouco tempo. Tente novamente mais tarde.' })
  }

  recentes.push(agora)
  limitesPorIp.set(chave, recentes)
  return next()
}

function requerAdmin(req, res, next) {
  if (!req.usuario || req.usuario.role !== 'admin') {
    return res.status(403).json({ sucesso: false, mensagem: 'Acesso restrito ao painel administrativo.' })
  }

  return next()
}

rotas.use(exigirAutenticacao)
rotas.use(aplicarRateLimit)
rotas.use(requerAdmin)

rotas.get('/dashboard/metricas', dashboardMetricas)
rotas.get('/usuarios', listarUsuarios)
rotas.put('/usuarios/:id/status', atualizarStatusUsuario)
rotas.delete('/usuarios/:id', excluirUsuario)
rotas.get('/relatorios', relatorios)

module.exports = rotas
