const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { after, test } = require('node:test')

const pastaTemporaria = fs.mkdtempSync(path.join(os.tmpdir(), 'dailymind-repositorio-'))
process.env.NODE_ENV = 'test'
process.env.CHAVE_SESSAO = crypto.randomBytes(48).toString('base64')
process.env.DAILYMIND_DB_PATH = path.join(pastaTemporaria, 'test.sqlite')

const repositorio = require('../src/repositorio')
const inicializacaoBanco = require('../iniciarBanco')
const banco = require('../src/config/conexaoBanco')

after(() => {
  banco.close()
  fs.rmSync(pastaTemporaria, { recursive: true, force: true })
})

test('oferece CRUD parametrizado para as nove tabelas existentes', async () => {
  await inicializacaoBanco
  const usuario = repositorio.criar('usuarios', {
    nome: 'Pessoa de Teste',
    email: 'repositorio@example.com',
    senha: 'scrypt$teste'
  })
  const usuarioId = Number(usuario.lastInsertRowid)
  const data = '2026-11-23'
  const registros = [
    ['sessoes', { id: 'sessao-teste', usuario_id: usuarioId, token_hash: 'a'.repeat(64), expira_em: '2026-11-30T00:00:00.000Z' }, { expira_em: '2026-12-01T00:00:00.000Z' }],
    ['humor', { usuario_id: usuarioId, emoji: '😊', data_registro: data }, { emoji: '😐' }],
    ['sono', { usuario_id: usuarioId, horas_sono: 8, qualidade: 4, data_registro: data }, { horas_sono: 7.5 }],
    ['energia', { usuario_id: usuarioId, nivel_energia: 7, data_registro: data }, { nivel_energia: 6 }],
    ['lembretes', { usuario_id: usuarioId, titulo: 'Lembrete de teste', horario: '08:30' }, { concluido: 1 }],
    ['sugestoes', { humor_tipo: 'neutro', titulo: 'Sugestão de teste', descricao: 'Descrição' }, { titulo: 'Sugestão atualizada' }],
    ['tarefas', { usuario_id: usuarioId, titulo: 'Tarefa de teste' }, { concluido: 1 }],
    ['metas', { usuario_id: usuarioId, titulo: 'Meta de teste', data_inicio: data, data_fim: '2026-12-23' }, { progresso: 25 }]
  ]

  for (const [tabela, dados, alteracoes] of registros) {
    const inserido = repositorio.criar(tabela, dados)
    const id = tabela === 'sessoes' ? dados.id : Number(inserido.lastInsertRowid)
    const opcoes = repositorio.tabelas[tabela].usuarioId ? { usuarioId } : {}

    assert.ok(repositorio.lerPorId(tabela, id, opcoes))
    assert.equal(repositorio.listar(tabela, opcoes).some(item => item.id === id), true)
    assert.equal(repositorio.atualizar(tabela, id, alteracoes, opcoes).changes, 1)
    assert.equal(repositorio.lerPorId(tabela, id, opcoes)[Object.keys(alteracoes)[0]], Object.values(alteracoes)[0])
    assert.equal(repositorio.excluir(tabela, id, opcoes).changes, 1)
    assert.equal(repositorio.lerPorId(tabela, id, opcoes), undefined)
  }

  assert.equal(repositorio.atualizar('usuarios', usuarioId, { nome: 'Nome Atualizado' }).changes, 1)
  assert.equal(repositorio.lerPorId('usuarios', usuarioId).nome, 'Nome Atualizado')
  assert.equal(repositorio.excluir('usuarios', usuarioId).changes, 1)
  assert.equal(banco.pragma('foreign_keys', { simple: true }), 1)
  assert.throws(() => repositorio.criar('humor', { usuario_id: 999999, emoji: 'feliz' }))
})

test('não permite consulta ou alteração sem escopo do usuário', async () => {
  await inicializacaoBanco
  assert.throws(() => repositorio.listar('tarefas'), /usuário é obrigatório/i)
  assert.throws(() => repositorio.lerPorId('metas', 1), /usuário é obrigatório/i)
  assert.throws(() => repositorio.criar('usuarios', { nome: 'x', email: 'x@example.com', senha: 'x', desconhecida: true }), /coluna não permitida/i)
})