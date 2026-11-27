const crypto = require('crypto')
const configuracao = require('../config/ambiente')
const banco = require('../repositorio')

const NOME_COOKIE = 'dailymind_session'
const DURACAO_SESSAO_MS = 7 * 24 * 60 * 60 * 1000
const chaveSessao = configuracao.chaveSessao

function resumirToken(token) {
  return crypto.createHmac('sha256', chaveSessao).update(token).digest('hex')
}

function definirCookie(res, valor, maxAge) {
  res.cookie(NOME_COOKIE, valor, {
    httpOnly: true,
    secure: configuracao.ambiente === 'production',
    sameSite: 'lax',
    path: '/api',
    maxAge
  })
}

function criarSessao(usuarioId, res) {
  const id = crypto.randomUUID()
  const token = crypto.randomBytes(32).toString('base64url')
  const expiraEm = new Date(Date.now() + DURACAO_SESSAO_MS).toISOString()

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

function autenticar(req, res, next, responderSemSessao) {
  const valor = lerCookie(req)
  const separador = valor ? valor.indexOf('.') : -1
  if (separador < 1) {
    return responderSemSessao('Autenticação necessária.')
  }

  const idSessao = valor.slice(0, separador)
  const token = valor.slice(separador + 1)
  const temRole = banco.temColuna('usuarios', 'role')
  const roleColuna = temRole ? 'usuarios.role' : "'user' AS role"
  const ativoColuna = banco.temColuna('usuarios', 'ativo') ? 'usuarios.ativo' : '1 AS ativo'
  const sessao = banco.prepare(
    `SELECT sessoes.id AS sessao_id, sessoes.token_hash, usuarios.id, usuarios.nome, usuarios.email,
      usuarios.idade, usuarios.ocupacao, usuarios.bio, usuarios.foto_perfil, usuarios.banner_perfil,
      ${roleColuna}, ${ativoColuna}
     FROM sessoes JOIN usuarios ON usuarios.id = sessoes.usuario_id
     WHERE sessoes.id = ? AND sessoes.expira_em > ?`
  ).get(idSessao, new Date().toISOString())

  if (!sessao) {
    return responderSemSessao('Sessão inválida ou expirada.')
  }

  if (!temRole && sessao.email.toLowerCase() === configuracao.adminEmail.toLowerCase()) {
    sessao.role = 'admin'
  }

  if (Number(sessao.ativo) === 0) {
    return res.status(403).json({ sucesso: false, mensagem: 'Esta conta foi desativada.' })
  }

  const hashArmazenado = Buffer.from(sessao.token_hash, 'hex')
  const hashRecebido = Buffer.from(resumirToken(token), 'hex')
  if (hashArmazenado.length !== hashRecebido.length || !crypto.timingSafeEqual(hashArmazenado, hashRecebido)) {
    return responderSemSessao('Sessão inválida ou expirada.')
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
    banner_perfil: sessao.banner_perfil,
    role: sessao.role || 'user',
    ativo: Number(sessao.ativo ?? 1)
  }
  return next()
}

function exigirAutenticacao(req, res, next) {
  return autenticar(req, res, next, mensagem => res.status(401).json({ sucesso: false, mensagem }))
}

// Usada na consulta de sessão ao abrir o app: não estar logado é uma resposta
// normal (200), e não um erro 401 registrado no console do navegador.
function verificarSessao(req, res, next) {
  return autenticar(req, res, next, () => res.json({ sucesso: false, usuario: null }))
}

function encerrarSessao(req, res) {
  if (req.sessaoId) banco.prepare('DELETE FROM sessoes WHERE id = ?').run(req.sessaoId)
  limparCookie(res)
}

module.exports = { criarSessao, exigirAutenticacao, verificarSessao, encerrarSessao }