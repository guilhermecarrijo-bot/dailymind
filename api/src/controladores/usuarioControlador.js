const banco = require('../config/conexaoBanco')
const crypto = require('crypto')

function hashSenha(senha) {
  return crypto.createHash('sha256').update(senha).digest('hex')
}

function cadastrarUsuario(req, res) {
  const { nome, email, senha, idade, ocupacao } = req.body

  if (typeof nome !== 'string' || nome.trim().length < 3) {
    return res.status(422).json({ sucesso: false, mensagem: 'Nome deve ter pelo menos 3 caracteres.' })
  }
  if (typeof email !== 'string' || !email.includes('@')) {
    return res.status(422).json({ sucesso: false, mensagem: 'E-mail inválido.' })
  }
  if (typeof senha !== 'string' || senha.length < 6) {
    return res.status(422).json({ sucesso: false, mensagem: 'Senha deve ter pelo menos 6 caracteres.' })
  }

  const existente = banco.prepare('SELECT id FROM usuarios WHERE email = ?').get(email)
  if (existente) {
    return res.status(409).json({ sucesso: false, mensagem: 'E-mail já cadastrado.' })
  }

  const senhaHash = hashSenha(senha)
  const inserir = banco.prepare(
    'INSERT INTO usuarios (nome, email, senha, idade, ocupacao) VALUES (?, ?, ?, ?, ?)'
  )
  const resultado = inserir.run(nome, email, senhaHash, idade || null, ocupacao || null)

  res.status(201).json({
    sucesso: true,
    mensagem: 'Conta criada com sucesso!',
    usuario: {
      id: Number(resultado.lastInsertRowid),
      nome,
      email,
      idade: idade || null,
      ocupacao: ocupacao || null,
      bio: null,
      foto_perfil: null,
      banner_perfil: null
    }
  })
}

function loginUsuario(req, res) {
  const { email, senha } = req.body

  if (!email || !senha) {
    return res.status(422).json({ sucesso: false, mensagem: 'E-mail e senha são obrigatórios.' })
  }

  const senhaHash = hashSenha(senha)
  const usuario = banco.prepare(
    'SELECT id, nome, email, idade, ocupacao, bio, foto_perfil, banner_perfil FROM usuarios WHERE email = ? AND senha = ?'
  ).get(email, senhaHash)

  if (!usuario) {
    return res.status(401).json({ sucesso: false, mensagem: 'E-mail ou senha incorretos.' })
  }

  res.json({ sucesso: true, mensagem: 'Login realizado com sucesso!', usuario })
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

module.exports = { cadastrarUsuario, loginUsuario, consultarPerfil, atualizarPerfil }
