const banco = require('../config/conexaoBanco')
const crypto = require('crypto')
const { promisify } = require('util')
const validator = require('validator')
const { criarSessao, encerrarSessao } = require('../seguranca/sessoes')

const scrypt = promisify(crypto.scrypt)
const PARAMETROS_SCRYPT = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }

async function hashSenha(senha) {
  const salt = crypto.randomBytes(16)
  const hash = await scrypt(senha, salt, 64, PARAMETROS_SCRYPT)
  return `scrypt$${PARAMETROS_SCRYPT.N}$${PARAMETROS_SCRYPT.r}$${PARAMETROS_SCRYPT.p}$${salt.toString('hex')}$${hash.toString('hex')}`
}

async function verificarSenha(senha, armazenada) {
  if (armazenada.startsWith('scrypt$')) {
    const [algoritmo, custo, blocos, paralelismo, saltHex, hashHex] = armazenada.split('$')
    if (algoritmo !== 'scrypt' || Number(custo) !== PARAMETROS_SCRYPT.N || Number(blocos) !== PARAMETROS_SCRYPT.r || Number(paralelismo) !== PARAMETROS_SCRYPT.p) {
      return { valida: false, legado: false }
    }
    const hashArmazenado = Buffer.from(hashHex, 'hex')
    const hashRecebido = await scrypt(senha, Buffer.from(saltHex, 'hex'), hashArmazenado.length, PARAMETROS_SCRYPT)
    return {
      valida: hashArmazenado.length === hashRecebido.length && crypto.timingSafeEqual(hashArmazenado, hashRecebido),
      legado: false
    }
  }

  const hashLegado = crypto.createHash('sha256').update(senha).digest()
  const hashArmazenado = Buffer.from(armazenada, 'hex')
  return {
    valida: hashArmazenado.length === hashLegado.length && crypto.timingSafeEqual(hashArmazenado, hashLegado),
    legado: true
  }
}

function selecionarUsuario(id) {
  return banco.prepare(
    'SELECT id, nome, email, idade, ocupacao, bio, foto_perfil, banner_perfil FROM usuarios WHERE id = ?'
  ).get(id)
}

async function cadastrarUsuario(req, res) {
  const { nome, email, senha, idade, ocupacao } = req.body
  const emailNormalizado = typeof email === 'string' ? email.trim().toLowerCase() : ''

  if (typeof nome !== 'string' || nome.trim().length < 3 || nome.trim().length > 100) {
    return res.status(422).json({ sucesso: false, mensagem: 'Nome deve ter entre 3 e 100 caracteres.' })
  }
  if (!validator.isEmail(emailNormalizado)) {
    return res.status(422).json({ sucesso: false, mensagem: 'E-mail inválido.' })
  }
  if (typeof senha !== 'string' || senha.length < 8 || senha.length > 128) {
    return res.status(422).json({ sucesso: false, mensagem: 'A senha deve ter entre 8 e 128 caracteres.' })
  }
  if (idade !== undefined && idade !== null && idade !== '' && (!Number.isInteger(idade) || idade < 1 || idade > 150)) {
    return res.status(422).json({ sucesso: false, mensagem: 'A idade deve estar entre 1 e 150 anos.' })
  }
  if (ocupacao !== undefined && ocupacao !== null && (typeof ocupacao !== 'string' || ocupacao.trim().length > 100)) {
    return res.status(422).json({ sucesso: false, mensagem: 'A ocupação pode ter no máximo 100 caracteres.' })
  }

  const existente = banco.prepare('SELECT id FROM usuarios WHERE email = ?').get(emailNormalizado)
  if (existente) {
    return res.status(409).json({ sucesso: false, mensagem: 'E-mail já cadastrado.' })
  }

  const senhaHash = await hashSenha(senha)
  const inserir = banco.prepare(
    'INSERT INTO usuarios (nome, email, senha, idade, ocupacao) VALUES (?, ?, ?, ?, ?)'
  )
  const resultado = inserir.run(nome.trim(), emailNormalizado, senhaHash, idade || null, ocupacao?.trim() || null)
  criarSessao(Number(resultado.lastInsertRowid), res)
  const usuario = selecionarUsuario(Number(resultado.lastInsertRowid))

  res.status(201).json({
    sucesso: true,
    mensagem: 'Conta criada com sucesso!',
    usuario
  })
}

async function loginUsuario(req, res) {
  const { email, senha } = req.body
  const emailNormalizado = typeof email === 'string' ? email.trim().toLowerCase() : ''

  if (!emailNormalizado || typeof senha !== 'string') {
    return res.status(422).json({ sucesso: false, mensagem: 'E-mail e senha são obrigatórios.' })
  }

  const conta = banco.prepare('SELECT id, senha FROM usuarios WHERE email = ?').get(emailNormalizado)
  const resultadoSenha = conta ? await verificarSenha(senha, conta.senha) : { valida: false, legado: false }

  if (!conta || !resultadoSenha.valida) {
    return res.status(401).json({ sucesso: false, mensagem: 'E-mail ou senha incorretos.' })
  }

  if (resultadoSenha.legado) {
    banco.prepare('UPDATE usuarios SET senha = ? WHERE id = ?').run(await hashSenha(senha), conta.id)
  }

  criarSessao(conta.id, res)
  res.json({ sucesso: true, mensagem: 'Login realizado com sucesso!', usuario: selecionarUsuario(conta.id) })
}

function consultarSessao(req, res) {
  res.json({ sucesso: true, usuario: req.usuario })
}

function logoutUsuario(req, res) {
  encerrarSessao(req, res)
  res.json({ sucesso: true, mensagem: 'Sessão encerrada.' })
}

function consultarPerfil(req, res) {
  const usuarioId = req.params.id_usuario || req.params.id
  const usuario = banco.prepare(
    'SELECT id, nome, email, idade, ocupacao, bio, foto_perfil, banner_perfil FROM usuarios WHERE id = ?'
  ).get(usuarioId)

  if (!usuario) {
    return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' })
  }

  res.json({ sucesso: true, usuario })
}

function atualizarPerfil(req, res) {
  const idUsuario = req.body.id_usuario || req.body.id
  const { nome, idade, ocupacao, bio, foto_perfil, banner_perfil } = req.body

  if (!idUsuario) {
    return res.status(422).json({ sucesso: false, mensagem: 'ID do usuário é obrigatório.' })
  }

  if (typeof nome !== 'string' || nome.trim().length < 3 || nome.trim().length > 100) {
    return res.status(422).json({ sucesso: false, mensagem: 'O nome deve ter entre 3 e 100 caracteres.' })
  }

  if (idade !== null && idade !== undefined && (!Number.isInteger(idade) || idade < 1 || idade > 150)) {
    return res.status(422).json({ sucesso: false, mensagem: 'A idade deve estar entre 1 e 150 anos.' })
  }

  if (ocupacao !== null && ocupacao !== undefined && (typeof ocupacao !== 'string' || ocupacao.trim().length > 100)) {
    return res.status(422).json({ sucesso: false, mensagem: 'A ocupação pode ter no máximo 100 caracteres.' })
  }

  if (bio !== null && bio !== undefined && (typeof bio !== 'string' || bio.trim().length > 280)) {
    return res.status(422).json({ sucesso: false, mensagem: 'A biografia pode ter no máximo 280 caracteres.' })
  }

  const existente = banco.prepare('SELECT id FROM usuarios WHERE id = ?').get(idUsuario)
  if (!existente) {
    return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' })
  }

  banco.prepare(
    `UPDATE usuarios SET
      nome = COALESCE(?, nome),
      idade = ?,
      ocupacao = ?,
      bio = ?,
      foto_perfil = ?,
      banner_perfil = ?
    WHERE id = ?`
  ).run(
    nome || null,
    idade || null,
    ocupacao || null,
    bio || null,
    foto_perfil || null,
    banner_perfil || null,
    idUsuario
  )

  const usuario = banco.prepare(
    'SELECT id, nome, email, idade, ocupacao, bio, foto_perfil, banner_perfil FROM usuarios WHERE id = ?'
  ).get(idUsuario)
  res.json({ sucesso: true, mensagem: 'Perfil atualizado!', usuario })
}

module.exports = { cadastrarUsuario, loginUsuario, consultarPerfil, atualizarPerfil, consultarSessao, logoutUsuario }
