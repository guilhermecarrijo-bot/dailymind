const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

const chaveSessao = process.env.CHAVE_SESSAO || undefined

if (chaveSessao && Buffer.byteLength(chaveSessao) < 32) {
  throw new Error('CHAVE_SESSAO deve ter pelo menos 32 bytes.')
}

const ambiente = process.env.NODE_ENV || 'development'

if (ambiente === 'production' && !chaveSessao) {
  throw new Error('CHAVE_SESSAO é obrigatória em produção.')
}

const porta = process.env.PORT || 3000
const origensPermitidasConfiguradas = (process.env.ORIGEM_PERMITIDA || 'http://localhost:8000,http://127.0.0.1:8000')
  .split(',')
  .map(origem => origem.trim())
  .filter(Boolean)
const origensPermitidas = [...new Set([
  ...origensPermitidasConfiguradas,
  `http://localhost:${porta}`,
  `http://127.0.0.1:${porta}`
])]

module.exports = Object.freeze({
  ambiente,
  porta,
  chaveSessao,
  caminhoBanco: process.env.DAILYMIND_DB_PATH
    ? path.resolve(process.env.DAILYMIND_DB_PATH)
    : undefined,
  origensPermitidas
})