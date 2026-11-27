const crypto = require('crypto')
const { promisify } = require('util')

const scrypt = promisify(crypto.scrypt)
const PARAMETROS_SCRYPT = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }

function formatarHash(salt, hash) {
  return `scrypt$${PARAMETROS_SCRYPT.N}$${PARAMETROS_SCRYPT.r}$${PARAMETROS_SCRYPT.p}$${salt.toString('hex')}$${hash.toString('hex')}`
}

function lerHashScrypt(armazenada) {
  const [algoritmo, custo, blocos, paralelismo, saltHex, hashHex] = String(armazenada).split('$')
  if (algoritmo !== 'scrypt' || Number(custo) !== PARAMETROS_SCRYPT.N || Number(blocos) !== PARAMETROS_SCRYPT.r || Number(paralelismo) !== PARAMETROS_SCRYPT.p) {
    return null
  }
  return { salt: Buffer.from(saltHex || '', 'hex'), hash: Buffer.from(hashHex || '', 'hex') }
}

function iguais(a, b) {
  return a.length > 0 && a.length === b.length && crypto.timingSafeEqual(a, b)
}

async function hashSenha(senha) {
  const salt = crypto.randomBytes(16)
  return formatarHash(salt, await scrypt(senha, salt, 64, PARAMETROS_SCRYPT))
}

function hashSenhaSync(senha) {
  const salt = crypto.randomBytes(16)
  return formatarHash(salt, crypto.scryptSync(senha, salt, 64, PARAMETROS_SCRYPT))
}

async function verificarSenha(senha, armazenada) {
  if (String(armazenada).startsWith('scrypt$')) {
    const partes = lerHashScrypt(armazenada)
    if (!partes) return { valida: false, legado: false }
    const recebido = await scrypt(senha, partes.salt, partes.hash.length || 64, PARAMETROS_SCRYPT)
    return { valida: iguais(partes.hash, recebido), legado: false }
  }

  const hashLegado = crypto.createHash('sha256').update(senha).digest()
  return { valida: iguais(Buffer.from(String(armazenada), 'hex'), hashLegado), legado: true }
}

function senhaConfereSync(senha, armazenada) {
  const partes = String(armazenada).startsWith('scrypt$') ? lerHashScrypt(armazenada) : null
  if (!partes) return false
  return iguais(partes.hash, crypto.scryptSync(senha, partes.salt, partes.hash.length || 64, PARAMETROS_SCRYPT))
}

module.exports = { hashSenha, hashSenhaSync, verificarSenha, senhaConfereSync }
