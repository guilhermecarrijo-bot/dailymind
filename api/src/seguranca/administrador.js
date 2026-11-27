const banco = require('../config/conexaoBanco')
const configuracao = require('../config/ambiente')
const { hashSenhaSync, senhaConfereSync } = require('./senhas')

const TAMANHO_MINIMO_SENHA = 12

// Garante que exista exatamente uma conta administradora, definida por
// ADMIN_EMAIL e ADMIN_PASSWORD. Roda a cada inicialização do banco, então
// funciona também em servidores sem acesso ao terminal (ex.: Render).
function garantirAdministrador({ email = configuracao.adminEmail, senha = configuracao.adminSenha } = {}) {
  const emailNormalizado = String(email || '').trim().toLowerCase()

  if (!emailNormalizado || !senha) {
    console.warn('ADMIN_EMAIL ou ADMIN_PASSWORD não definidos: a conta administradora não foi configurada.')
    return { configurado: false }
  }
  if (String(senha).length < TAMANHO_MINIMO_SENHA) {
    console.warn(`ADMIN_PASSWORD deve ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres: a conta administradora não foi configurada.`)
    return { configurado: false }
  }

  const existente = banco.prepare('SELECT id, senha FROM usuarios WHERE lower(email) = ?').get(emailNormalizado)

  const resultado = banco.transaction(() => {
    let id
    let senhaAlterada = false

    if (existente) {
      id = existente.id
      senhaAlterada = !senhaConfereSync(senha, existente.senha)
      banco.prepare("UPDATE usuarios SET role = 'admin', ativo = 1 WHERE id = ?").run(id)
      if (senhaAlterada) {
        banco.prepare('UPDATE usuarios SET senha = ? WHERE id = ?').run(hashSenhaSync(senha), id)
        // Sessões abertas com a senha antiga deixam de valer.
        banco.prepare('DELETE FROM sessoes WHERE usuario_id = ?').run(id)
      }
    } else {
      id = Number(banco.prepare(
        "INSERT INTO usuarios (nome, email, senha, ocupacao, role, ativo) VALUES (?, ?, ?, ?, 'admin', 1)"
      ).run('Administrador DailyMind', emailNormalizado, hashSenhaSync(senha), 'Administrador').lastInsertRowid)
    }

    // Apenas a conta configurada mantém acesso administrativo.
    const rebaixadas = banco.prepare(
      "SELECT id FROM usuarios WHERE role = 'admin' AND id <> ?"
    ).all(id).map(conta => conta.id)
    for (const idRebaixado of rebaixadas) {
      banco.prepare("UPDATE usuarios SET role = 'user' WHERE id = ?").run(idRebaixado)
      banco.prepare('DELETE FROM sessoes WHERE usuario_id = ?').run(idRebaixado)
    }

    return { configurado: true, id, criado: !existente, senhaAlterada, rebaixadas: rebaixadas.length }
  })()

  console.log(`Conta administradora pronta: ${emailNormalizado}.`)
  return resultado
}

module.exports = { garantirAdministrador, TAMANHO_MINIMO_SENHA }
