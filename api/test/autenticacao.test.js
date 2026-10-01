const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const http = require('node:http')
const os = require('node:os')
const path = require('node:path')
const { after, test } = require('node:test')

const pastaTemporaria = fs.mkdtempSync(path.join(os.tmpdir(), 'dailymind-auth-'))
process.env.NODE_ENV = 'test'
process.env.CHAVE_SESSAO = crypto.randomBytes(48).toString('base64')
process.env.DAILYMIND_DB_PATH = path.join(pastaTemporaria, 'test.sqlite')

const app = require('../src/app')
require('../iniciarBanco')
const banco = require('../src/config/conexaoBanco')
const servidor = http.createServer(app)
const servidorPronto = new Promise(resolve => servidor.listen(0, '127.0.0.1', resolve))

after(async () => {
  await new Promise(resolve => servidor.close(resolve))
  banco.close()
  fs.rmSync(pastaTemporaria, { recursive: true, force: true })
})

test('protege sessões e dados pessoais por usuário', async () => {
  await servidorPronto
  const api = `http://127.0.0.1:${servidor.address().port}/api`

  async function requisitar(caminho, metodo = 'GET', corpo, cookie) {
    const resposta = await fetch(`${api}${caminho}`, {
      method: metodo,
      headers: {
        ...(corpo ? { 'Content-Type': 'application/json' } : {}),
        ...(cookie ? { Cookie: cookie } : {})
      },
      ...(corpo ? { body: JSON.stringify(corpo) } : {})
    })
    return {
      status: resposta.status,
      corpo: await resposta.json(),
      cookie: resposta.headers.get('set-cookie')
    }
  }

  async function cadastrar(nome, email) {
    const resposta = await requisitar('/usuarios/cadastro', 'POST', {
      nome,
      email,
      senha: 'senha-segura-123'
    })
    assert.equal(resposta.status, 201)
    assert.match(resposta.cookie, /HttpOnly/)
    assert.doesNotMatch(JSON.stringify(resposta.corpo), new RegExp(process.env.CHAVE_SESSAO))
    return {
      usuario: resposta.corpo.usuario,
      cookie: resposta.cookie.split(';')[0]
    }
  }

  const emailA = `a-${crypto.randomUUID()}@example.com`
  const emailB = `b-${crypto.randomUUID()}@example.com`
  const usuarioA = await cadastrar('Pessoa Um', emailA)
  const usuarioB = await cadastrar('Pessoa Dois', emailB)

  const idadeInvalida = await requisitar('/usuarios/cadastro', 'POST', {
    nome: 'Pessoa Teste',
    email: `idade-${crypto.randomUUID()}@example.com`,
    senha: 'senha-segura-123',
    idade: -1
  })
  assert.equal(idadeInvalida.status, 422)

  const ocupacaoInvalida = await requisitar('/usuarios/cadastro', 'POST', {
    nome: 'Pessoa Teste',
    email: `ocupacao-${crypto.randomUUID()}@example.com`,
    senha: 'senha-segura-123',
    ocupacao: 'x'.repeat(101)
  })
  assert.equal(ocupacaoInvalida.status, 422)

  assert.equal((await requisitar('/health')).status, 200)
  assert.equal((await requisitar(`/usuarios/${usuarioA.usuario.id}`)).status, 401)
  assert.equal((await requisitar(`/usuarios/${usuarioA.usuario.id}`, 'GET', null, usuarioA.cookie)).status, 200)
  assert.equal((await requisitar(`/usuarios/${usuarioB.usuario.id}`, 'GET', null, usuarioA.cookie)).status, 403)
  assert.equal((await requisitar('/humor', 'POST', {
    usuario_id: usuarioB.usuario.id,
    emoji: 'feliz'
  }, usuarioA.cookie)).status, 403)
  assert.equal((await requisitar('/humor', 'POST', {
    usuario_id: usuarioA.usuario.id,
    emoji: 'feliz'
  }, usuarioA.cookie)).status, 201)

  banco.prepare('UPDATE usuarios SET senha = ? WHERE id = ?').run(
    crypto.createHash('sha256').update('senha-segura-123').digest('hex'),
    usuarioB.usuario.id
  )

  const login = await requisitar('/usuarios/login', 'POST', {
    email: emailB,
    senha: 'senha-segura-123'
  })
  assert.equal(login.status, 200)
  const cookieLogin = login.cookie.split(';')[0]
  assert.equal((await requisitar('/usuarios/sessao', 'GET', null, cookieLogin)).status, 200)
  assert.match(banco.prepare('SELECT senha FROM usuarios WHERE id = ?').get(usuarioB.usuario.id).senha, /^scrypt\$/)

  assert.equal((await requisitar('/usuarios/logout', 'POST', {}, usuarioA.cookie)).status, 200)
  assert.equal((await requisitar('/usuarios/sessao', 'GET', null, usuarioA.cookie)).status, 401)

  const meta = await requisitar('/metas', 'POST', {
    usuario_id: usuarioB.usuario.id,
    titulo: 'Meta de teste',
    data_inicio: '2000-01-01',
    data_fim: '2999-12-31'
  }, cookieLogin)
  assert.equal(meta.status, 201)

  const dataImpossivel = await requisitar('/metas', 'POST', {
    usuario_id: usuarioB.usuario.id,
    titulo: 'Data impossível',
    data_inicio: '2025-02-30',
    data_fim: '2025-03-03'
  }, cookieLogin)
  assert.equal(dataImpossivel.status, 422)

  banco.prepare('UPDATE metas SET status = ? WHERE id = ?').run('não_iniciada', meta.corpo.meta.id)
  const metasAtivas = await requisitar(`/metas/${usuarioB.usuario.id}/ativas`, 'GET', null, cookieLogin)
  assert.equal(metasAtivas.corpo.dados.some(item => item.id === meta.corpo.meta.id), true)
  assert.equal(metasAtivas.corpo.dados.find(item => item.id === meta.corpo.meta.id).status, 'em_andamento')

  const atualizarProgresso = await requisitar(`/metas/${meta.corpo.meta.id}/progresso`, 'PUT', { progresso: 37 }, cookieLogin)
  assert.equal(atualizarProgresso.status, 200)
  const progressoFracionado = await requisitar(`/metas/${meta.corpo.meta.id}/progresso`, 'PUT', { progresso: 37.5 }, cookieLogin)
  assert.equal(progressoFracionado.status, 422)
  const metasListadas = await requisitar(`/metas/${usuarioB.usuario.id}?status=em_andamento`, 'GET', null, cookieLogin)
  assert.equal(metasListadas.corpo.dados.find(item => item.id === meta.corpo.meta.id).progresso, 37)
  const metaPorId = await requisitar(`/metas/item/${meta.corpo.meta.id}`, 'GET', null, cookieLogin)
  assert.equal(metaPorId.status, 200)
  assert.equal(metaPorId.corpo.dados.progresso, 37)
  const estatisticasMeta = await requisitar(`/metas/${usuarioB.usuario.id}/estatisticas`, 'GET', null, cookieLogin)
  assert.equal(estatisticasMeta.corpo.estatisticas.progresso_medio, 37)
  const periodoInvalido = await requisitar(`/metas/${meta.corpo.meta.id}`, 'PUT', {
    data_fim: '1999-12-31'
  }, cookieLogin)
  assert.equal(periodoInvalido.status, 422)
  const periodoAtualizado = await requisitar(`/metas/${meta.corpo.meta.id}`, 'PUT', {
    data_inicio: '2998-01-01',
    data_fim: '2999-12-31'
  }, cookieLogin)
  assert.equal(periodoAtualizado.status, 200)
  const metaComProgressoAutomatico = await requisitar(`/metas/item/${meta.corpo.meta.id}`, 'GET', null, cookieLogin)
  assert.equal(metaComProgressoAutomatico.corpo.dados.progresso, 0)

  const tarefa = await requisitar('/tarefas', 'POST', {
    usuario_id: usuarioB.usuario.id,
    titulo: 'Tarefa de teste'
  }, cookieLogin)
  assert.equal(tarefa.status, 201)
  const tarefaEmBranco = await requisitar('/tarefas', 'POST', {
    usuario_id: usuarioB.usuario.id,
    titulo: '   '
  }, cookieLogin)
  assert.equal(tarefaEmBranco.status, 422)
  const descricaoInvalida = await requisitar('/tarefas', 'POST', {
    usuario_id: usuarioB.usuario.id,
    titulo: 'Tarefa válida',
    descricao: { texto: 'não é string' }
  }, cookieLogin)
  assert.equal(descricaoInvalida.status, 422)

  const lembreteEmBranco = await requisitar('/lembretes', 'POST', {
    usuario_id: usuarioB.usuario.id,
    titulo: '   '
  }, cookieLogin)
  assert.equal(lembreteEmBranco.status, 422)
  const tarefaPorId = await requisitar(`/tarefas/item/${tarefa.corpo.tarefa.id}`, 'GET', null, cookieLogin)
  assert.equal(tarefaPorId.status, 200)
  assert.equal(tarefaPorId.corpo.dados.titulo, 'Tarefa de teste')

  const loginA = await requisitar('/usuarios/login', 'POST', {
    email: emailA,
    senha: 'senha-segura-123'
  })
  assert.equal(loginA.status, 200)
  const tarefaDeOutroUsuario = await requisitar(`/tarefas/item/${tarefa.corpo.tarefa.id}`, 'GET', null, loginA.cookie.split(';')[0])
  assert.equal(tarefaDeOutroUsuario.status, 403)
})