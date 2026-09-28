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
})