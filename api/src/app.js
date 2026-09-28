const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const rotasDailyMind = require('./rotas/dailyMindRotas')

const app = express()
const origensPermitidas = (process.env.ORIGEM_PERMITIDA || 'http://localhost:8000,http://127.0.0.1:8000,http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map(origem => origem.trim())
  .filter(Boolean)

// Middlewares de segurança e parsing
app.use(helmet({
  contentSecurityPolicy: false
}))
app.use(cors({
  origin: (origem, callback) => callback(null, !origem || origensPermitidas.includes(origem)),
  credentials: true
}))
app.use(express.json({ limit: '12mb' }))

// Servir arquivos estáticos do frontend
const caminhoFrontend = path.resolve(__dirname, '../../frontend')
app.use(express.static(caminhoFrontend))

// Rotas da API
// Rota de health check
app.get('/api/health', (_, res) => res.json({ sucesso: true, mensagem: 'DailyMind API funcionando!' }))
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
