const banco = require('../config/conexaoBanco')
const crypto = require('crypto')

function hashSenha(senha) {
  return crypto.createHash('sha256').update(senha).digest('hex')
}

function cadastrarUsuario(req, res) {
  const { nome, email, senha, tipo_usuario } = req.body

  if (!nome || nome.length < 3) {
    return res.status(422).json({ sucesso: false, mensagem: 'Nome deve ter pelo menos 3 caracteres.' })
  }
  if (!email || !email.includes('@')) {
    return res.status(422).json({ sucesso: false, mensagem: 'E-mail inválido.' })
  }
  if (!senha || senha.length < 6) {
    return res.status(422).json({ sucesso: false, mensagem: 'Senha deve ter pelo menos 6 caracteres.' })
  }

  const tipo = tipo_usuario || 'usuário'

  const existente = banco.prepare('SELECT id_usuario FROM USUARIO WHERE email = ?').get(email)
  if (existente) {
    return res.status(409).json({ sucesso: false, mensagem: 'E-mail já cadastrado.' })
  }

  const senhaHash = hashSenha(senha)
  const inserir = banco.prepare(
    'INSERT INTO USUARIO (nome, email, senha, tipo_usuario) VALUES (?, ?, ?, ?)'
  )
  const resultado = inserir.run(nome, email, senhaHash, tipo)

  res.status(201).json({
    sucesso: true,
    mensagem: 'Conta criada com sucesso!',
    usuario: { id_usuario: resultado.lastInsertRowid, nome, email, tipo_usuario: tipo }
  })
}

function loginUsuario(req, res) {
  const { email, senha } = req.body

  if (!email || !senha) {
    return res.status(422).json({ sucesso: false, mensagem: 'E-mail e senha são obrigatórios.' })
  }

  const senhaHash = hashSenha(senha)
  const usuario = banco.prepare('SELECT id_usuario, nome, email, tipo_usuario FROM USUARIO WHERE email = ? AND senha = ?').get(email, senhaHash)

  if (!usuario) {
    return res.status(401).json({ sucesso: false, mensagem: 'E-mail ou senha incorretos.' })
  }

  res.json({ sucesso: true, mensagem: 'Login realizado com sucesso!', usuario })
}

function atualizarPerfil(req, res) {
  const { id_usuario, nome, tipo_usuario } = req.body

  if (!id_usuario) {
    return res.status(422).json({ sucesso: false, mensagem: 'ID do usuário é obrigatório.' })
  }

  const atualizar = banco.prepare(
    'UPDATE USUARIO SET nome = COALESCE(?, nome), tipo_usuario = COALESCE(?, tipo_usuario) WHERE id_usuario = ?'
  )
  atualizar.run(nome || null, tipo_usuario || null, id_usuario)

  const usuario = banco.prepare('SELECT id_usuario, nome, email, tipo_usuario FROM USUARIO WHERE id_usuario = ?').get(id_usuario)
  res.json({ sucesso: true, mensagem: 'Perfil atualizado!', usuario })
}

module.exports = { cadastrarUsuario, loginUsuario, atualizarPerfil }
