const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const rotasDailyMind = require('./rotas/dailyMindRotas')

const app = express()

// Middlewares de segurança e parsing
app.use(helmet({
  contentSecurityPolicy: false
}))
app.use(cors({ origin: process.env.ORIGEM_PERMITIDA || '*' }))
app.use(express.json({ limit: '10kb' }))

// Servir arquivos estáticos do frontend
const caminhoFrontend = path.resolve(__dirname, '../../frontend')
app.use(express.static(caminhoFrontend))

// Rotas da API
app.use('/api', rotasDailyMind)

// Rota de health check
app.get('/api/health', (_, res) => res.json({ sucesso: true, mensagem: 'DailyMind API funcionando!' }))

// Fallback para o frontend
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(caminhoFrontend, 'index.html'))
})

module.exports = app
