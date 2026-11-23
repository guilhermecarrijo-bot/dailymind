const banco = require('../repositorio')
const { dataLocal } = require('../utilitarios/data')

function obterSugestoes(req, res) {
  const usuario_id = Number(req.usuario.id)

  if (!usuario_id) {
    return res.status(422).json({ sucesso: false, mensagem: 'Usuário obrigatório.' })
  }

  const humor = banco.prepare(
    'SELECT emoji FROM humor WHERE usuario_id = ? ORDER BY data_registro DESC LIMIT 1'
  ).get(usuario_id)
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

  const tipos = []
  if (humor?.emoji) tipos.push(mapaHumor[humor.emoji] || 'neutro')

  const sono = banco.prepare(
    'SELECT horas_sono FROM sono WHERE usuario_id = ? ORDER BY data_registro DESC LIMIT 1'
  ).get(usuario_id)
  const energia = banco.prepare(
    'SELECT nivel_energia FROM energia WHERE usuario_id = ? ORDER BY data_registro DESC LIMIT 1'
  ).get(usuario_id)
  const tarefasPendentes = banco.prepare(
    'SELECT COUNT(*) AS total FROM tarefas WHERE usuario_id = ? AND concluido = 0'
  ).get(usuario_id).total
  const metasAtivas = banco.prepare(
    'SELECT COUNT(*) AS total FROM metas WHERE usuario_id = ? AND data_inicio <= ? AND data_fim >= ?'
  ).get(usuario_id, dataLocal(), dataLocal()).total

  if (sono && sono.horas_sono < 6) tipos.push('cansado')
  if (energia && energia.nivel_energia <= 3) tipos.push('cansado')
  if (energia && energia.nivel_energia >= 8) tipos.push('feliz')
  if (tarefasPendentes > 0 || metasAtivas > 0) tipos.push('neutro')
  if (!tipos.length) tipos.push('neutro')

  const buscarPorTipo = banco.prepare(
    'SELECT * FROM sugestoes WHERE humor_tipo = ? ORDER BY RANDOM() LIMIT 1'
  )
  const sugestoes = [...new Set(tipos)].slice(0, 3)
    .map(tipo => buscarPorTipo.get(tipo))
    .filter(Boolean)

  return res.json({ sucesso: true, dados: sugestoes })
}

function listarTodasSugestoes(req, res) {
  const sugestoes = banco.prepare('SELECT * FROM sugestoes ORDER BY id ASC').all()
  return res.json({ sucesso: true, dados: sugestoes })
}

module.exports = { obterSugestoes, listarTodasSugestoes }
