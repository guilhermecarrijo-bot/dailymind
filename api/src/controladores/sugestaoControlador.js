const banco = require('../config/conexaoBanco')

// Mapeamento de emojis para tipos de humor
const mapearHumor = {
  '😊': 'feliz',
  '😄': 'feliz',
  '😁': 'feliz',
  '😔': 'triste',
  '😢': 'triste',
  '😭': 'triste',
  '😰': 'ansioso',
  '😟': 'ansioso',
  '😫': 'cansado',
  '😴': 'cansado',
  '😤': 'irritado',
  '😠': 'irritado',
  '😐': 'neutro',
  '😑': 'neutro'
}

// Obter sugestões baseadas no humor
function obterSugestoes(req, res) {
  const usuario_id = req.params.usuario_id

  // Buscar humor de hoje
  const hoje = new Date().toISOString().split('T')[0]
  const humorRegistro = banco.prepare(
    'SELECT emoji FROM humor WHERE usuario_id = ? AND data_registro = ?'
  ).get(usuario_id, hoje)

  if (!humorRegistro) {
    return res.json({ sucesso: true, dados: [], mensagem: 'Registre seu humor primeiro!' })
  }

  const tipoHumor = mapearHumor[humorRegistro.emoji] || 'neutro'
  const sugestoes = banco.prepare(
    'SELECT * FROM sugestoes WHERE humor_tipo = ? ORDER BY RANDOM() LIMIT 3'
  ).all(tipoHumor)

  res.json({ sucesso: true, dados: sugestoes, humor: tipoHumor })
}

// Listar todas as sugestões
function listarTodasSugestoes(req, res) {
  const sugestoes = banco.prepare('SELECT * FROM sugestoes ORDER BY humor_tipo, titulo').all()
  res.json({ sucesso: true, dados: sugestoes })
}

module.exports = { obterSugestoes, listarTodasSugestoes }
