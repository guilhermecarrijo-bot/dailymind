const crypto = require('crypto')
const banco = require('../config/conexaoBanco')

const NOME_COOKIE = 'dailymind_session'
const DURACAO_SESSAO_MS = 7 * 24 * 60 * 60 * 1000
const chaveConfigurada = process.env.CHAVE_SESSAO

if (chaveConfigurada && Buffer.byteLength(chaveConfigurada) < 32) {
  throw new Error('CHAVE_SESSAO deve ter pelo menos 32 bytes.')
}

if (process.env.NODE_ENV === 'production' && !chaveConfigurada) {
  throw new Error('CHAVE_SESSAO é obrigatória em produção.')
}

const chaveSessao = chaveConfigurada || crypto.randomBytes(48)

function resumirToken(token) {
  return crypto.createHmac('sha256', chaveSessao).update(token).digest('hex')
}

function definirCookie(res, valor, maxAge) {
  res.cookie(NOME_COOKIE, valor, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api',
    maxAge
  })
}

function criarSessao(usuarioId, res) {
  const id = crypto.randomUUID()
  const token = crypto.randomBytes(32).toString('base64url')
  const expiraEm = new Date(Date.now() + DURACAO_SESSAO_MS).toISOString()

  banco.prepare('DELETE FROM sessoes WHERE expira_em <= ?').run(new Date().toISOString())
  banco.prepare('INSERT INTO sessoes (id, usuario_id, token_hash, expira_em) VALUES (?, ?, ?, ?)')
    .run(id, usuarioId, resumirToken(token), expiraEm)

  definirCookie(res, `${id}.${token}`, DURACAO_SESSAO_MS)
}

function limparCookie(res) {
  definirCookie(res, '', 0)
}

function lerCookie(req) {
  const cookies = (req.headers.cookie || '').split(';')
  const cookie = cookies.map(parte => parte.trim()).find(parte => parte.startsWith(`${NOME_COOKIE}=`))
  return cookie ? cookie.slice(NOME_COOKIE.length + 1) : null
}

function exigirAutenticacao(req, res, next) {
  const valor = lerCookie(req)
  const separador = valor ? valor.indexOf('.') : -1
  if (separador < 1) {
    return res.status(401).json({ sucesso: false, mensagem: 'Autenticação necessária.' })
  }

  const idSessao = valor.slice(0, separador)
  const token = valor.slice(separador + 1)
  const sessao = banco.prepare(
    `SELECT sessoes.id AS sessao_id, sessoes.token_hash, usuarios.id, usuarios.nome, usuarios.email,
      usuarios.idade, usuarios.ocupacao, usuarios.bio, usuarios.foto_perfil, usuarios.banner_perfil
     FROM sessoes JOIN usuarios ON usuarios.id = sessoes.usuario_id
     WHERE sessoes.id = ? AND sessoes.expira_em > ?`
  ).get(idSessao, new Date().toISOString())

  if (!sessao) {
    return res.status(401).json({ sucesso: false, mensagem: 'Sessão inválida ou expirada.' })
  }

  const hashArmazenado = Buffer.from(sessao.token_hash, 'hex')
  const hashRecebido = Buffer.from(resumirToken(token), 'hex')
  if (hashArmazenado.length !== hashRecebido.length || !crypto.timingSafeEqual(hashArmazenado, hashRecebido)) {
    return res.status(401).json({ sucesso: false, mensagem: 'Sessão inválida ou expirada.' })
  }

  req.sessaoId = sessao.sessao_id
  req.usuario = {
    id: sessao.id,
    nome: sessao.nome,
    email: sessao.email,
    idade: sessao.idade,
    ocupacao: sessao.ocupacao,
    bio: sessao.bio,
    foto_perfil: sessao.foto_perfil,
    banner_perfil: sessao.banner_perfil
  }
  return next()
}

function encerrarSessao(req, res) {
  if (req.sessaoId) banco.prepare('DELETE FROM sessoes WHERE id = ?').run(req.sessaoId)
  limparCookie(res)
}

module.exports = { criarSessao, exigirAutenticacao, encerrarSessao }