const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const http = require('node:http')
const os = require('node:os')
const path = require('node:path')
const { after, test } = require('node:test')

const pastaTemporaria = fs.mkdtempSync(path.join(os.tmpdir(), 'dailymind-admin-'))
const EMAIL_ADMIN = 'administrador@teste.dailymind'
const SENHA_ADMIN = 'senha-admin-teste-123'
process.env.NODE_ENV = 'test'
process.env.CHAVE_SESSAO = crypto.randomBytes(48).toString('base64')
process.env.DAILYMIND_DB_PATH = path.join(pastaTemporaria, 'test.sqlite')
process.env.ADMIN_EMAIL = EMAIL_ADMIN
process.env.ADMIN_PASSWORD = SENHA_ADMIN

const app = require('../src/app')
require('../iniciarBanco')
const banco = require('../src/config/conexaoBanco')
const { garantirAdministrador } = require('../src/seguranca/administrador')
const { dataLocal } = require('../src/utilitarios/data')
const servidor = http.createServer(app)
const servidorPronto = new Promise(resolve => servidor.listen(0, '127.0.0.1', resolve))

after(async () => {
  await new Promise(resolve => servidor.close(resolve))
  banco.close()
  fs.rmSync(pastaTemporaria, { recursive: true, force: true })
})

async function requisitar(caminho, metodo = 'GET', corpo = null, cookie = '') {
  const resposta = await fetch(`http://127.0.0.1:${servidor.address().port}/api${caminho}`, {
    method: metodo,
    headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    body: corpo ? JSON.stringify(corpo) : undefined
  })
  return {
    status: resposta.status,
    corpo: await resposta.json(),
    cookie: (resposta.headers.get('set-cookie') || '').split(';')[0]
  }
}

const entrar = (email, senha) => requisitar('/usuarios/login', 'POST', { email, senha })

test('área administrativa: login próprio, estatísticas e gestão de usuários', async () => {
  await servidorPronto
  const hoje = dataLocal()

  const admin = await entrar(EMAIL_ADMIN, SENHA_ADMIN)
  assert.equal(admin.status, 200)
  assert.equal(admin.corpo.usuario.role, 'admin')
  assert.equal((await entrar(EMAIL_ADMIN, 'senha-errada-123')).status, 401)
  assert.equal((await requisitar('/usuarios/cadastro', 'POST', { nome: 'Intruso', email: EMAIL_ADMIN, senha: 'outra-senha-123' })).status, 409)

  const ana = await requisitar('/usuarios/cadastro', 'POST', { nome: 'Ana 100%', email: 'ana@example.com', senha: 'senha-segura-123' })
  const bruno = await requisitar('/usuarios/cadastro', 'POST', { nome: 'Bruno', email: 'bruno@example.com', senha: 'senha-segura-123' })
  assert.equal(ana.status, 201)
  assert.equal(bruno.status, 201)
  assert.equal((await entrar('ana@example.com', 'senha-segura-123')).status, 200)

  // Humor salvo por nome (formato antigo) e por emoji conta como a mesma emoção.
  const inserirHumor = banco.prepare('INSERT INTO humor (usuario_id, emoji, data_registro) VALUES (?, ?, ?)')
  inserirHumor.run(ana.corpo.usuario.id, '😊', hoje)
  inserirHumor.run(bruno.corpo.usuario.id, 'feliz', hoje)
  inserirHumor.run(bruno.corpo.usuario.id, '😰', hoje)
  banco.prepare('INSERT INTO sono (usuario_id, horas_sono, qualidade, data_registro) VALUES (?, ?, ?, ?)').run(ana.corpo.usuario.id, 7, 4, hoje)
  banco.prepare('INSERT INTO energia (usuario_id, nivel_energia, data_registro) VALUES (?, ?, ?)').run(ana.corpo.usuario.id, 8, hoje)

  assert.equal((await requisitar('/admin/resumo', 'GET', null, ana.cookie)).status, 403)
  assert.equal((await requisitar('/admin/resumo')).status, 401)

  const resumo = await requisitar('/admin/resumo', 'GET', null, admin.cookie)
  assert.equal(resumo.status, 200)
  const { totais, emocao_mais_usada: maisUsada } = resumo.corpo.dados
  assert.equal(totais.usuarios, 2)
  assert.equal(totais.usuarios_novos, 2)
  assert.equal(totais.usuarios_ativos, 2)
  assert.equal(totais.acessos, 3)
  assert.equal(totais.registros_humor, 3)
  assert.equal(totais.media_sono, 7)
  assert.equal(totais.media_energia, 8)
  assert.deepEqual(maisUsada, { emoji: '😊', total: 2, usuarios: 2, percentual: 67 })
  assert.equal(resumo.corpo.dados.atividade_diaria.length, 30)
  assert.deepEqual(resumo.corpo.dados.atividade_diaria.at(-1), { dia: hoje, acessos: 3, usuarios_ativos: 2, registros: 5 })
  assert.equal(resumo.corpo.dados.usuarios_por_mes.length, 12)
  assert.equal(resumo.corpo.dados.usuarios_por_mes.at(-1).total, 2)

  for (const consulta of ['inicio=2026-02-30', 'inicio=2026-05-10&fim=2026-05-01', 'inicio=2020-01-01&fim=2026-01-01']) {
    assert.equal((await requisitar(`/admin/resumo?${consulta}`, 'GET', null, admin.cookie)).status, 422)
  }

  const lista = await requisitar('/admin/usuarios?limit=10', 'GET', null, admin.cookie)
  assert.equal(lista.status, 200)
  assert.equal(lista.corpo.total, 2)
  assert.ok(lista.corpo.dados.every(usuario => usuario.email !== EMAIL_ADMIN))
  const linhaAna = lista.corpo.dados.find(usuario => usuario.email === 'ana@example.com')
  assert.equal(linhaAna.total_acessos, 2)
  assert.equal(linhaAna.total_registros, 3)
  assert.equal(linhaAna.emocao_mais_usada, '😊')
  assert.ok(linhaAna.ultimo_acesso.startsWith(hoje))

  const busca = await requisitar(`/admin/usuarios?search=${encodeURIComponent('100%')}`, 'GET', null, admin.cookie)
  assert.deepEqual(busca.corpo.dados.map(usuario => usuario.nome), ['Ana 100%'])
  assert.equal((await requisitar('/admin/usuarios?search=%25', 'GET', null, admin.cookie)).corpo.total, 1)

  const idAdmin = admin.corpo.usuario.id
  assert.equal((await requisitar(`/admin/usuarios/${idAdmin}/status`, 'PUT', { ativo: false }, admin.cookie)).status, 403)
  assert.equal((await requisitar(`/admin/usuarios/${idAdmin}`, 'DELETE', null, admin.cookie)).status, 403)
  assert.equal((await requisitar(`/admin/usuarios/${ana.corpo.usuario.id}/status`, 'PUT', { ativo: 'nao' }, admin.cookie)).status, 422)
  assert.equal((await requisitar('/admin/usuarios/abc/status', 'PUT', { ativo: false }, admin.cookie)).status, 400)
  assert.equal((await requisitar('/admin/usuarios/99999', 'DELETE', null, admin.cookie)).status, 404)

  // Desativar encerra as sessões e bloqueia novos logins.
  assert.equal((await requisitar(`/admin/usuarios/${ana.corpo.usuario.id}/status`, 'PUT', { ativo: false }, admin.cookie)).status, 200)
  assert.deepEqual((await requisitar('/usuarios/sessao', 'GET', null, ana.cookie)).corpo, { sucesso: false, usuario: null })
  assert.equal((await entrar('ana@example.com', 'senha-segura-123')).status, 403)
  assert.equal((await requisitar(`/admin/usuarios/${ana.corpo.usuario.id}/status`, 'PUT', { ativo: true }, admin.cookie)).status, 200)
  assert.equal((await entrar('ana@example.com', 'senha-segura-123')).status, 200)

  assert.equal((await requisitar(`/admin/usuarios/${bruno.corpo.usuario.id}`, 'DELETE', null, admin.cookie)).status, 200)
  assert.equal((await requisitar('/admin/usuarios', 'GET', null, admin.cookie)).corpo.total, 1)

  // Trocar a senha no ambiente invalida a antiga e as sessões abertas;
  // qualquer outra conta com papel de admin perde o acesso.
  banco.prepare("UPDATE usuarios SET role = 'admin' WHERE id = ?").run(ana.corpo.usuario.id)
  const novaSenha = 'nova-senha-admin-456'
  const resultado = garantirAdministrador({ email: EMAIL_ADMIN, senha: novaSenha })
  assert.equal(resultado.senhaAlterada, true)
  assert.equal(resultado.rebaixadas, 1)
  assert.equal((await requisitar('/admin/resumo', 'GET', null, admin.cookie)).status, 401)
  assert.equal((await entrar(EMAIL_ADMIN, SENHA_ADMIN)).status, 401)
  assert.equal((await entrar(EMAIL_ADMIN, novaSenha)).status, 200)
  assert.equal((await entrar('ana@example.com', 'senha-segura-123')).corpo.usuario.role, 'user')

  assert.equal(garantirAdministrador({ email: EMAIL_ADMIN, senha: 'curta' }).configurado, false)
  assert.equal(garantirAdministrador({ email: EMAIL_ADMIN, senha: novaSenha }).senhaAlterada, false)
})
