const banco = require('../config/conexaoBanco')

function obterSugestoes(req, res) {
  const usuario_id = Number(req.params.usuario_id)

  if (!usuario_id) {
    return res.status(422).json({ sucesso: false, mensagem: 'Usuário obrigatório.' })
  }

  const humor = banco.prepare(
    'SELECT emoji FROM humor WHERE usuario_id = ? ORDER BY data_registro DESC LIMIT 1'
  ).get(usuario_id)

  if (!humor || !humor.emoji) {
    const sugestoesGerais = banco.prepare(
      'SELECT * FROM sugestoes ORDER BY RANDOM() LIMIT 3'
    ).all()
    return res.json({ sucesso: true, dados: sugestoesGerais })
  }

  const mapaHumor = {
    '😊': 'feliz',
    feliz: 'feliz',
    '😔': 'triste',
    triste: 'triste',
    '😰': 'ansioso',
    ansioso: 'ansioso',
    '😫': 'cansado',
    cansado: 'cansado',
    '😤': 'irritado',
    irritado: 'irritado',
    '😐': 'neutro',
    neutro: 'neutro'
  }

  const tipo = mapaHumor[humor.emoji] || 'neutro'

  const sugestoes = banco.prepare(
    'SELECT * FROM sugestoes WHERE humor_tipo = ? ORDER BY RANDOM() LIMIT 3'
  ).all(tipo)

  return res.json({ sucesso: true, dados: sugestoes })
}

function listarTodasSugestoes(req, res) {
  const sugestoes = banco.prepare('SELECT * FROM sugestoes ORDER BY id ASC').all()
  return res.json({ sucesso: true, dados: sugestoes })
}

module.exports = { obterSugestoes, listarTodasSugestoes }
