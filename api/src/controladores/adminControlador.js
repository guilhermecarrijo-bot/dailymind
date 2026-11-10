const banco = require('../config/conexaoBanco')

function normalizarLista(value, padrao) {
  const numero = Number(value)
  if (!Number.isFinite(numero) || numero <= 0) return padrao
  return numero
}

function montarListaUsuarios(usuario, filtros, total) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    role: usuario.role || 'user',
    ativo: Number(usuario.ativo ?? 1),
    data_cadastro: usuario.data_cadastro
  }
}

function dashboardMetricas(req, res) {
  const metricas = {
    usuarios: banco.prepare('SELECT COUNT(*) AS total FROM usuarios').get().total,
    humor_30_dias: banco.prepare("SELECT COUNT(*) AS total FROM humor WHERE data_registro >= date('now', '-30 days')").get().total,
    media_sono: banco.prepare("SELECT AVG(horas_sono) AS media FROM sono WHERE data_registro >= date('now', '-30 days')").get().media || 0,
    media_energia: banco.prepare("SELECT AVG(nivel_energia) AS media FROM energia WHERE data_registro >= date('now', '-30 days')").get().media || 0,
    lembretes_concluidos: banco.prepare('SELECT COUNT(*) AS total FROM lembretes WHERE concluido = 1').get().total,
    lembretes_pendentes: banco.prepare('SELECT COUNT(*) AS total FROM lembretes WHERE concluido = 0').get().total
  }

  return res.json({ sucesso: true, dados: metricas })
}

function listarUsuarios(req, res) {
  const pagina = normalizarLista(req.query.page, 1)
  const limite = Math.min(normalizarLista(req.query.limit, 10), 100)
  const offset = (pagina - 1) * limite
  const pesquisa = String(req.query.search || '').trim()
  const inicio = String(req.query.inicio || '').trim()
  const fim = String(req.query.fim || '').trim()

  const condicoes = []
  const parametros = []

  if (pesquisa) {
    condicoes.push('(nome LIKE ? OR email LIKE ?)')
    parametros.push(`%${pesquisa}%`, `%${pesquisa}%`)
  }

  if (inicio) {
    condicoes.push('date(data_cadastro) >= date(?)')
    parametros.push(inicio)
  }

  if (fim) {
    condicoes.push('date(data_cadastro) <= date(?)')
    parametros.push(fim)
  }

  const filtro = condicoes.length ? `WHERE ${condicoes.join(' AND ')}` : ''
  const totalSql = `SELECT COUNT(*) AS total FROM usuarios ${filtro}`
  const total = banco.prepare(totalSql).get(...parametros).total

  const sqlUsuarios = `SELECT id, nome, email, role, ativo, data_cadastro FROM usuarios ${filtro} ORDER BY data_cadastro DESC LIMIT ? OFFSET ?`
  const usuarios = banco.prepare(sqlUsuarios).all(...parametros, limite, offset)

  return res.json({
    sucesso: true,
    dados: usuarios.map(montarListaUsuarios),
    pagina,
    limite,
    total,
    totalPaginas: Math.max(1, Math.ceil(total / limite))
  })
}

function atualizarStatusUsuario(req, res) {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ sucesso: false, mensagem: 'ID de usuário inválido.' })
  }

  if (req.usuario.id === id && req.body.ativo === false) {
    return res.status(403).json({ sucesso: false, mensagem: 'Você não pode desativar sua própria conta de administrador.' })
  }

  const atual = banco.prepare('SELECT id, nome, email, role, ativo FROM usuarios WHERE id = ?').get(id)
  if (!atual) {
    return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' })
  }

  const campos = []
  const valores = []

  if (req.body.ativo !== undefined) {
    campos.push('ativo = ?')
    valores.push(req.body.ativo === true || req.body.ativo === 1 || req.body.ativo === 'true' ? 1 : 0)
  }

  if (req.body.role !== undefined && ['user', 'admin'].includes(String(req.body.role))) {
    campos.push('role = ?')
    valores.push(String(req.body.role))
  }

  if (campos.length === 0) {
    return res.status(422).json({ sucesso: false, mensagem: 'Informe ao menos um campo válido para atualizar o status.' })
  }

  banco.prepare(`UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`).run(...valores, id)

  const usuarioAtualizado = banco.prepare('SELECT id, nome, email, role, ativo, data_cadastro FROM usuarios WHERE id = ?').get(id)
  return res.json({ sucesso: true, mensagem: 'Status do usuário atualizado.', usuario: montarListaUsuarios(usuarioAtualizado) })
}

function excluirUsuario(req, res) {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ sucesso: false, mensagem: 'ID de usuário inválido.' })
  }

  if (req.usuario.id === id) {
    return res.status(403).json({ sucesso: false, mensagem: 'Você não pode excluir sua própria conta.' })
  }

  const usuario = banco.prepare('SELECT id FROM usuarios WHERE id = ?').get(id)
  if (!usuario) {
    return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' })
  }

  banco.prepare('DELETE FROM usuarios WHERE id = ?').run(id)
  return res.json({ sucesso: true, mensagem: 'Usuário removido com sucesso.' })
}

function relatorios(req, res) {
  const hoje = new Date()
  const dataFim = new Date(hoje)
  const dataInicio = new Date(hoje)
  dataInicio.setDate(dataFim.getDate() - 30)

  const inicio = String(req.query.inicio || dataInicio.toISOString().slice(0, 10)).trim()
  const fim = String(req.query.fim || dataFim.toISOString().slice(0, 10)).trim()

  const usuariosNovos = banco.prepare('SELECT COUNT(*) AS total FROM usuarios WHERE date(data_cadastro) BETWEEN date(?) AND date(?)').get(inicio, fim).total
  const registrosHumor = banco.prepare('SELECT COUNT(*) AS total FROM humor WHERE date(data_registro) BETWEEN date(?) AND date(?)').get(inicio, fim).total
  const registrosSono = banco.prepare('SELECT COUNT(*) AS total FROM sono WHERE date(data_registro) BETWEEN date(?) AND date(?)').get(inicio, fim).total
  const registrosEnergia = banco.prepare('SELECT COUNT(*) AS total FROM energia WHERE date(data_registro) BETWEEN date(?) AND date(?)').get(inicio, fim).total
  const humorDist = banco.prepare('SELECT emoji, COUNT(*) AS total FROM humor WHERE date(data_registro) BETWEEN date(?) AND date(?) GROUP BY emoji ORDER BY total DESC').all(inicio, fim)
  const engajamento = banco.prepare(`SELECT date(data_registro) AS dia, COUNT(*) AS total FROM (
      SELECT data_registro FROM humor WHERE date(data_registro) BETWEEN date(?) AND date(?)
      UNION ALL
      SELECT data_registro FROM sono WHERE date(data_registro) BETWEEN date(?) AND date(?)
      UNION ALL
      SELECT data_registro FROM energia WHERE date(data_registro) BETWEEN date(?) AND date(?)
    ) GROUP BY dia ORDER BY dia DESC`).all(inicio, fim, inicio, fim, inicio, fim)

  const inicioDezembro = new Date(`${fim}T12:00:00Z`)
  inicioDezembro.setMonth(inicioDezembro.getMonth() - 11)
  const usersPorMes = banco.prepare(
    `SELECT strftime('%Y-%m', data_cadastro) AS mes, COUNT(*) AS total
      FROM usuarios
      WHERE date(data_cadastro) BETWEEN date(?) AND date(?)
      GROUP BY strftime('%Y-%m', data_cadastro)
      ORDER BY mes ASC`
  ).all(inicioDezembro.toISOString().slice(0, 10), fim)

  return res.json({
    sucesso: true,
    dados: {
      periodo: { inicio, fim },
      usuarios_novos: usuariosNovos,
      registros_humor: registrosHumor,
      registros_sono: registrosSono,
      registros_energia: registrosEnergia,
      distribuicao_humor: humorDist,
      engajamento_diario: engajamento,
      usuarios_por_mes: usersPorMes
    }
  })
}

module.exports = {
  dashboardMetricas,
  listarUsuarios,
  atualizarStatusUsuario,
  excluirUsuario,
  relatorios
}
