const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
const configuracao = require('./config/ambiente')

const rotasDailyMind = require('./rotas/dailyMindRotas')
const rotasAdmin = require('./rotas/adminRotas')

const app = express()
// O Render (e outros proxies) encaminha o IP real em X-Forwarded-For.
app.set('trust proxy', 1)
// Middlewares de segurança e parsing
app.use(helmet({
  contentSecurityPolicy: false
}))
app.use(cors({
  origin: (origem, callback) => {
    if (!origem) return callback(null, true)

    let permitida = configuracao.origensPermitidas.includes(origem)
    if (configuracao.ambiente !== 'production') {
      try {
        const urlOrigem = new URL(origem)
        permitida ||= ['localhost', '127.0.0.1'].includes(urlOrigem.hostname)
          || /^(192\.168\.|10\.\d{1,3}\.|172\.(1[6-9]|2\d|3[01])\.)/.test(urlOrigem.hostname)
      } catch (_) { permitida = false }
    }

    callback(permitida ? null : new Error('Origem não permitida pelo CORS'), permitida)
  },
  credentials: true
}))
app.use(express.json({ limit: '12mb' }))

// Servir arquivos estáticos do frontend
const caminhoFrontend = path.resolve(__dirname, '../../frontend')
app.use(express.static(caminhoFrontend))

// Rotas da API
// Rota de health check
app.get('/api/health', (_, res) => res.json({ sucesso: true, mensagem: 'DailyMind API funcionando!' }))
app.use('/api/admin', rotasAdmin)
app.use('/api', rotasDailyMind)

// Fallback para o frontend
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(caminhoFrontend, 'index.html'))
})

app.use((erro, req, res, next) => {
  if (res.headersSent) return next(erro)
  console.error(erro)
  res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
})

module.exports = app
