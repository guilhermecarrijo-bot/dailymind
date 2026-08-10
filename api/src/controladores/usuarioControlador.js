const banco = require('../config/conexaoBanco')
const crypto = require('crypto')

// Função auxiliar para hash de senhas (usando SHA-256 simples para demo)
function hashSenha(senha) {
  return crypto.createHash('sha256').update(senha).digest('hex')
}

// Cadastro de novo usuário
function cadastrarUsuario(req, res) {
  const { nome, email, senha, idade, ocupacao } = req.body

  if (!nome || nome.length < 3) {
    return res.status(422).json({ sucesso: false, mensagem: 'Nome deve ter pelo menos 3 caracteres.' })
  }
  if (!email || !email.includes('@')) {
    return res.status(422).json({ sucesso: false, mensagem: 'E-mail inválido.' })
  }
  if (!senha || senha.length < 6) {
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
    usuario: { id: resultado.lastInsertRowid, nome, email }
  })
}

// Login do usuário
function loginUsuario(req, res) {
  const { email, senha } = req.body

  if (!email || !senha) {
    return res.status(422).json({ sucesso: false, mensagem: 'E-mail e senha são obrigatórios.' })
  }

  const senhaHash = hashSenha(senha)
  const usuario = banco.prepare('SELECT id, nome, email, idade, ocupacao FROM usuarios WHERE email = ? AND senha = ?').get(email, senhaHash)

  if (!usuario) {
    return res.status(401).json({ sucesso: false, mensagem: 'E-mail ou senha incorretos.' })
  }

  res.json({ sucesso: true, mensagem: 'Login realizado com sucesso!', usuario })
}

// Atualizar perfil do usuário
function atualizarPerfil(req, res) {
  const { id, nome, idade, ocupacao } = req.body

  if (!id) {
    return res.status(422).json({ sucesso: false, mensagem: 'ID do usuário é obrigatório.' })
  }

  const atualizar = banco.prepare(
    'UPDATE usuarios SET nome = COALESCE(?, nome), idade = ?, ocupacao = ? WHERE id = ?'
  )
  atualizar.run(nome || null, idade || null, ocupacao || null, id)

  const usuario = banco.prepare('SELECT id, nome, email, idade, ocupacao FROM usuarios WHERE id = ?').get(id)
  res.json({ sucesso: true, mensagem: 'Perfil atualizado!', usuario })
}

module.exports = { cadastrarUsuario, loginUsuario, atualizarPerfil }
