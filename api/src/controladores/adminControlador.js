const banco = require('../repositorio')
const { dataLocal } = require('../utilitarios/data')

const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/
const DIA_MS = 24 * 60 * 60 * 1000
const MAXIMO_DIAS_PERIODO = 366

// O painel analisa apenas as contas comuns; a conta administradora fica de fora.
const USUARIOS_COMUNS = "SELECT id FROM usuarios WHERE COALESCE(role, 'user') <> 'admin'"

// Registros antigos podem ter o humor salvo por nome; todos viram emoji.
const HUMOR_NORMALIZADO = `CASE emoji
  WHEN 'feliz' THEN '😊' WHEN 'triste' THEN '😔' WHEN 'ansioso' THEN '😰'
  WHEN 'cansado' THEN '😫' WHEN 'irritado' THEN '😤' WHEN 'neutro' THEN '😐'
  ELSE emoji END`

function somarDias(data, dias) {
  return new Date(Date.parse(`${data}T00:00:00Z`) + dias * DIA_MS).toISOString().slice(0, 10)
}

function dataValida(texto) {
  return FORMATO_DATA.test(texto) && new Date(`${texto}T00:00:00Z`).toISOString().slice(0, 10) === texto
}

function lerPeriodo(query) {
  const fim = String(query.fim || dataLocal()).trim()
  const inicio = String(query.inicio || somarDias(fim, -29)).trim()
  if (!dataValida(inicio) || !dataValida(fim)) return null

  const dias = Math.round((Date.parse(`${fim}T00:00:00Z`) - Date.parse(`${inicio}T00:00:00Z`)) / DIA_MS) + 1
  if (dias < 1 || dias > MAXIMO_DIAS_PERIODO) return null
  return { inicio, fim, dias }
}

function periodoInvalido(res) {
  return res.status(422).json({ sucesso: false, mensagem: 'Período inválido.' })
}

function contar(sql, ...parametros) {
  return Number(banco.prepare(sql).get(...parametros).total || 0)
}

function media(sql, ...parametros) {
  const valor = banco.prepare(sql).get(...parametros).media
  return valor === null || valor === undefined ? null : Math.round(Number(valor) * 10) / 10
}

function resumo(req, res) {
  const periodo = lerPeriodo(req.query)
  if (!periodo) return periodoInvalido(res)
  const { inicio, fim } = periodo
  const noPeriodo = coluna => `date(${coluna}) BETWEEN date(?) AND date(?)`
  const deUsuarioComum = `usuario_id IN (${USUARIOS_COMUNS})`

  const totais = {
    usuarios: contar(`SELECT COUNT(*) AS total FROM (${USUARIOS_COMUNS})`),
    usuarios_inativos: contar(`SELECT COUNT(*) AS total FROM usuarios WHERE COALESCE(role, 'user') <> 'admin' AND ativo = 0`),
    usuarios_novos: contar(`SELECT COUNT(*) AS total FROM usuarios WHERE COALESCE(role, 'user') <> 'admin' AND ${noPeriodo('data_cadastro')}`, inicio, fim),
    usuarios_ativos: contar(`SELECT COUNT(DISTINCT usuario_id) AS total FROM acessos WHERE ${deUsuarioComum} AND ${noPeriodo('data_hora')}`, inicio, fim),
    acessos: contar(`SELECT COUNT(*) AS total FROM acessos WHERE ${deUsuarioComum} AND ${noPeriodo('data_hora')}`, inicio, fim),
    registros_humor: contar(`SELECT COUNT(*) AS total FROM humor WHERE ${deUsuarioComum} AND ${noPeriodo('data_registro')}`, inicio, fim),
    registros_sono: contar(`SELECT COUNT(*) AS total FROM sono WHERE ${deUsuarioComum} AND ${noPeriodo('data_registro')}`, inicio, fim),
    registros_energia: contar(`SELECT COUNT(*) AS total FROM energia WHERE ${deUsuarioComum} AND ${noPeriodo('data_registro')}`, inicio, fim),
    media_sono: media(`SELECT AVG(horas_sono) AS media FROM sono WHERE ${deUsuarioComum} AND ${noPeriodo('data_registro')}`, inicio, fim),
    media_energia: media(`SELECT AVG(nivel_energia) AS media FROM energia WHERE ${deUsuarioComum} AND ${noPeriodo('data_registro')}`, inicio, fim)
  }

  const distribuicaoHumor = banco.prepare(
    `SELECT ${HUMOR_NORMALIZADO} AS emoji, COUNT(*) AS total, COUNT(DISTINCT usuario_id) AS usuarios
     FROM humor WHERE ${deUsuarioComum} AND ${noPeriodo('data_registro')}
     GROUP BY 1 ORDER BY total DESC, emoji`
  ).all(inicio, fim)

  const maisUsada = distribuicaoHumor[0]
  const emocaoMaisUsada = maisUsada
    ? { ...maisUsada, percentual: Math.round((maisUsada.total / totais.registros_humor) * 100) }
    : null

  // Cadastros nos 12 meses que terminam no mês final do período.
  const mesFinal = fim.slice(0, 7)
  const meses = Array.from({ length: 12 }, (_, indice) => {
    const data = new Date(`${mesFinal}-01T00:00:00Z`)
    data.setUTCMonth(data.getUTCMonth() - (11 - indice))
    return data.toISOString().slice(0, 7)
  })
  const cadastrosPorMes = new Map(banco.prepare(
    `SELECT strftime('%Y-%m', data_cadastro) AS mes, COUNT(*) AS total
     FROM usuarios
     WHERE COALESCE(role, 'user') <> 'admin' AND strftime('%Y-%m', data_cadastro) BETWEEN ? AND ?
     GROUP BY 1`
  ).all(meses[0], mesFinal).map(linha => [linha.mes, linha.total]))

  const porDia = (sql) => new Map(banco.prepare(sql).all(inicio, fim).map(linha => [linha.dia, linha]))
  const acessosPorDia = porDia(
    `SELECT date(data_hora) AS dia, COUNT(*) AS acessos, COUNT(DISTINCT usuario_id) AS usuarios
     FROM acessos WHERE ${deUsuarioComum} AND ${noPeriodo('data_hora')} GROUP BY 1`
  )
  const registrosPorDia = new Map()
  for (const tabela of ['humor', 'sono', 'energia']) {
    for (const linha of banco.prepare(
      `SELECT date(data_registro) AS dia, COUNT(*) AS total FROM ${tabela}
       WHERE ${deUsuarioComum} AND ${noPeriodo('data_registro')} GROUP BY 1`
    ).all(inicio, fim)) {
      registrosPorDia.set(linha.dia, (registrosPorDia.get(linha.dia) || 0) + linha.total)
    }
  }
  const atividadeDiaria = Array.from({ length: periodo.dias }, (_, indice) => {
    const dia = somarDias(inicio, indice)
    return {
      dia,
      acessos: acessosPorDia.get(dia)?.acessos || 0,
      usuarios_ativos: acessosPorDia.get(dia)?.usuarios || 0,
      registros: registrosPorDia.get(dia) || 0
    }
  })

  return res.json({
    sucesso: true,
    dados: {
      periodo: { inicio, fim },
      totais,
      emocao_mais_usada: emocaoMaisUsada,
      distribuicao_humor: distribuicaoHumor,
      usuarios_por_mes: meses.map(mes => ({ mes, total: cadastrosPorMes.get(mes) || 0 })),
      atividade_diaria: atividadeDiaria
    }
  })
}

function numeroPositivo(valor, padrao) {
  const numero = Number(valor)
  return Number.isInteger(numero) && numero > 0 ? numero : padrao
}

function listarUsuarios(req, res) {
  const limite = Math.min(numeroPositivo(req.query.limit, 10), 50)
  const pesquisa = String(req.query.search || '').trim().slice(0, 100)

  const condicoes = ["COALESCE(u.role, 'user') <> 'admin'"]
  const parametros = []
  if (pesquisa) {
    const termo = `%${pesquisa.replace(/[\\%_]/g, caractere => `\\${caractere}`)}%`
    condicoes.push("(u.nome LIKE ? ESCAPE '\\' OR u.email LIKE ? ESCAPE '\\')")
    parametros.push(termo, termo)
  }
  const filtro = `WHERE ${condicoes.join(' AND ')}`

  const total = contar(`SELECT COUNT(*) AS total FROM usuarios u ${filtro}`, ...parametros)
  const totalPaginas = Math.max(1, Math.ceil(total / limite))
  const pagina = Math.min(numeroPositivo(req.query.page, 1), totalPaginas)

  const usuarios = banco.prepare(
    `SELECT u.id, u.nome, u.email, COALESCE(u.ativo, 1) AS ativo, u.data_cadastro,
       (SELECT MAX(data_hora) FROM acessos WHERE usuario_id = u.id) AS ultimo_acesso,
       (SELECT COUNT(*) FROM acessos WHERE usuario_id = u.id) AS total_acessos,
       (SELECT COUNT(*) FROM humor WHERE usuario_id = u.id)
         + (SELECT COUNT(*) FROM sono WHERE usuario_id = u.id)
         + (SELECT COUNT(*) FROM energia WHERE usuario_id = u.id) AS total_registros,
       (SELECT ${HUMOR_NORMALIZADO} FROM humor WHERE usuario_id = u.id
         GROUP BY 1 ORDER BY COUNT(*) DESC, MAX(data_registro) DESC LIMIT 1) AS emocao_mais_usada
     FROM usuarios u ${filtro}
     ORDER BY COALESCE(ultimo_acesso, u.data_cadastro) DESC, u.id DESC
     LIMIT ? OFFSET ?`
  ).all(...parametros, limite, (pagina - 1) * limite)

  return res.json({
    sucesso: true,
    dados: usuarios.map(usuario => ({ ...usuario, ativo: Number(usuario.ativo) })),
    pagina,
    limite,
    total,
    totalPaginas
  })
}

function buscarUsuarioGerenciavel(req, res) {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ sucesso: false, mensagem: 'ID de usuário inválido.' })
    return null
  }

  const usuario = banco.prepare("SELECT id, COALESCE(role, 'user') AS role FROM usuarios WHERE id = ?").get(id)
  if (!usuario) {
    res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' })
    return null
  }
  if (usuario.role === 'admin' || usuario.id === req.usuario.id) {
    res.status(403).json({ sucesso: false, mensagem: 'A conta administradora não pode ser alterada pelo painel.' })
    return null
  }
  return usuario
}

function atualizarStatusUsuario(req, res) {
  if (typeof req.body?.ativo !== 'boolean') {
    return res.status(422).json({ sucesso: false, mensagem: 'Informe ao menos um campo válido para atualizar o status.' })
  }
  const usuario = buscarUsuarioGerenciavel(req, res)
  if (!usuario) return undefined

  banco.transacao(() => {
    banco.prepare('UPDATE usuarios SET ativo = ? WHERE id = ?').run(req.body.ativo ? 1 : 0, usuario.id)
    // Uma conta desativada sai imediatamente de todos os dispositivos.
    if (!req.body.ativo) banco.prepare('DELETE FROM sessoes WHERE usuario_id = ?').run(usuario.id)
  })()
  return res.json({ sucesso: true, mensagem: 'Status do usuário atualizado.' })
}

function excluirUsuario(req, res) {
  const usuario = buscarUsuarioGerenciavel(req, res)
  if (!usuario) return undefined

  banco.prepare('DELETE FROM usuarios WHERE id = ?').run(usuario.id)
  return res.json({ sucesso: true, mensagem: 'Usuário removido com sucesso.' })
}

module.exports = {
  resumo,
  listarUsuarios,
  atualizarStatusUsuario,
  excluirUsuario
}
