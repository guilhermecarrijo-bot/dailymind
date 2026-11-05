const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

const chaveSessao = process.env.CHAVE_SESSAO || undefined

if (chaveSessao && Buffer.byteLength(chaveSessao) < 32) {
  throw new Error('CHAVE_SESSAO deve ter pelo menos 32 bytes.')
}

const ambiente = process.env.NODE_ENV || 'development'

if (ambiente === 'production' && !chaveSessao) {
  throw new Error('CHAVE_SESSAO e obrigatoria em producao.')
}

const porta = process.env.PORT || 3000

if (!Number.isInteger(Number(porta)) || Number(porta) <= 0) {
  throw new Error('PORT invalido.')
}

const frontendOrigin = process.env.FRONTEND_ORIGIN || ''
if (frontendOrigin === '*') {
  throw new Error('FRONTEND_ORIGIN nao pode ser "*" quando ha cookies com credenciais.')
}

const dbPath = process.env.DAILYMIND_DB_PATH
  ? path.resolve(process.env.DAILYMIND_DB_PATH)
  : path.join(path.resolve(__dirname, '../../db'), 'dailymind.db')

const pastaPublica = path.resolve(__dirname, '../../frontend')
const foraDePastaPublica = !path.resolve(dbPath).startsWith(pastaPublica + path.sep) && path.resolve(dbPath) !== pastaPublica

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
  caminhoBanco: dbPath,
  frontendOrigin: frontendOrigin,
  origensPermitidas
})