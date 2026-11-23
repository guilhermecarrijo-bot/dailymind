const banco = require('./config/conexaoBanco')

const tabelas = Object.freeze({
  usuarios: {
    id: 'id',
    usuarioId: false,
    colunas: ['id', 'nome', 'email', 'senha', 'idade', 'ocupacao', 'data_cadastro', 'bio', 'foto_perfil', 'banner_perfil', 'role', 'ativo']
  },
  sessoes: {
    id: 'id',
    usuarioId: true,
    colunas: ['id', 'usuario_id', 'token_hash', 'expira_em', 'criada_em']
  },
  humor: {
    id: 'id',
    usuarioId: true,
    colunas: ['id', 'usuario_id', 'emoji', 'data_registro']
  },
  sono: {
    id: 'id',
    usuarioId: true,
    colunas: ['id', 'usuario_id', 'horas_sono', 'qualidade', 'data_registro']
  },
  energia: {
    id: 'id',
    usuarioId: true,
    colunas: ['id', 'usuario_id', 'nivel_energia', 'data_registro']
  },
  lembretes: {
    id: 'id',
    usuarioId: true,
    colunas: ['id', 'usuario_id', 'titulo', 'icone', 'horario', 'objeto_deixado', 'hora_deixado', 'concluido', 'data_criacao']
  },
  sugestoes: {
    id: 'id',
    usuarioId: false,
    colunas: ['id', 'humor_tipo', 'titulo', 'descricao', 'icone']
  },
  tarefas: {
    id: 'id',
    usuarioId: true,
    colunas: ['id', 'usuario_id', 'titulo', 'descricao', 'icone', 'concluido', 'data_criacao', 'data_conclusao']
  },
  metas: {
    id: 'id',
    usuarioId: true,
    colunas: ['id', 'usuario_id', 'titulo', 'descricao', 'icone', 'data_inicio', 'data_fim', 'progresso', 'progresso_manual', 'status', 'data_criacao']
  }
})

banco.pragma('foreign_keys = ON')

function definicao(tabela) {
  const config = tabelas[tabela]
  if (!config) throw new Error(`Tabela não permitida: ${tabela}`)
  return config
}

function temColuna(tabela, coluna) {
  const config = definicao(tabela)
  if (!config.colunas.includes(coluna)) return false
  return banco.pragma(`table_info(${tabela})`).some(item => item.name === coluna)
}

function colunasValidas(tabela, dados, incluirId = false) {
  const config = definicao(tabela)
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    throw new TypeError('Os dados devem ser um objeto.')
  }

  const entradas = Object.entries(dados).filter(([coluna]) => incluirId || coluna !== config.id)
  const desconhecidas = entradas.filter(([coluna]) => !config.colunas.includes(coluna))
  if (desconhecidas.length) throw new Error(`Coluna não permitida: ${desconhecidas[0][0]}`)
  if (!entradas.length) throw new Error('Informe ao menos uma coluna.')
  return entradas
}

function escopoUsuario(config, usuarioId) {
  if (!config.usuarioId) return { sql: '', parametros: [] }
  if (usuarioId === undefined || usuarioId === null || usuarioId === '') {
    throw new Error('O usuário é obrigatório para acessar esta tabela.')
  }
  return { sql: ' AND usuario_id = ?', parametros: [usuarioId] }
}

function criar(tabela, dados) {
  const entradas = colunasValidas(tabela, dados, true)
  const nomes = entradas.map(([coluna]) => coluna)
  const marcadores = nomes.map(() => '?')
  return banco.prepare(
    `INSERT INTO ${tabela} (${nomes.join(', ')}) VALUES (${marcadores.join(', ')})`
  ).run(...entradas.map(([, valor]) => valor))
}

function lerPorId(tabela, id, opcoes = {}) {
  const config = definicao(tabela)
  const escopo = escopoUsuario(config, opcoes.usuarioId)
  return banco.prepare(
    `SELECT * FROM ${tabela} WHERE ${config.id} = ?${escopo.sql}`
  ).get(id, ...escopo.parametros)
}

function listar(tabela, opcoes = {}) {
  const config = definicao(tabela)
  const escopo = escopoUsuario(config, opcoes.usuarioId)
  return banco.prepare(`SELECT * FROM ${tabela} WHERE 1 = 1${escopo.sql}`)
    .all(...escopo.parametros)
}

function atualizar(tabela, id, dados, opcoes = {}) {
  const config = definicao(tabela)
  const entradas = colunasValidas(tabela, dados)
  const escopo = escopoUsuario(config, opcoes.usuarioId)
  const atribuicoes = entradas.map(([coluna]) => `${coluna} = ?`)
  return banco.prepare(
    `UPDATE ${tabela} SET ${atribuicoes.join(', ')} WHERE ${config.id} = ?${escopo.sql}`
  ).run(...entradas.map(([, valor]) => valor), id, ...escopo.parametros)
}

function excluir(tabela, id, opcoes = {}) {
  const config = definicao(tabela)
  const escopo = escopoUsuario(config, opcoes.usuarioId)
  return banco.prepare(
    `DELETE FROM ${tabela} WHERE ${config.id} = ?${escopo.sql}`
  ).run(id, ...escopo.parametros)
}

module.exports = {
  criar,
  lerPorId,
  listar,
  atualizar,
  excluir,
  tabelas,
  temColuna,
  prepare: sql => banco.prepare(sql),
  preparar: sql => banco.prepare(sql),
  transacao: callback => banco.transaction(callback)
}