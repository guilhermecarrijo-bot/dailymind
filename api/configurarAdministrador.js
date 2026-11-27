// Define o e-mail e a senha da conta administradora em api/.env e aplica no banco.
// Uso: npm run admin:setup            (mantém a senha atual, ou gera uma se não houver)
//      npm run admin:setup -- --rotate (gera uma senha nova)
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const configurarAmbiente = require('./configurarAmbiente')

const caminhoEnv = path.join(__dirname, '.env')

function atualizarEnv(conteudo, chave, valor) {
  const linhas = conteudo.split(/\r?\n/)
  const expressao = new RegExp(`^${chave}\\s*=.*$`)
  let encontrou = false
  for (let indice = 0; indice < linhas.length; indice++) {
    if (expressao.test(linhas[indice])) {
      linhas[indice] = `${chave}=${valor}`
      encontrou = true
    }
  }
  if (!encontrou) linhas.push(`${chave}=${valor}`)
  return linhas.join('\n')
}

function lerValorEnv(conteudo, chave) {
  const linha = conteudo.split(/\r?\n/).find(item => item.startsWith(`${chave}=`))
  return linha ? linha.slice(chave.length + 1).trim().replace(/^(["'])(.*)\1$/, '$2') : ''
}

function gerarSenha() {
  // 4 blocos de 5 caracteres sem símbolos ambíguos (0/O, 1/l/I).
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  const blocos = Array.from({ length: 4 }, () =>
    Array.from({ length: 5 }, () => alfabeto[crypto.randomInt(alfabeto.length)]).join(''))
  return blocos.join('-')
}

configurarAmbiente()
let conteudoEnv = fs.readFileSync(caminhoEnv, 'utf8')
const email = (process.env.ADMIN_EMAIL || lerValorEnv(conteudoEnv, 'ADMIN_EMAIL') || 'administrador@dailymind.com.br').trim().toLowerCase()
const senhaAtual = lerValorEnv(conteudoEnv, 'ADMIN_PASSWORD')
const senha = process.argv.includes('--rotate') || senhaAtual.length < 12 ? gerarSenha() : senhaAtual

conteudoEnv = atualizarEnv(conteudoEnv, 'ADMIN_EMAIL', email)
conteudoEnv = atualizarEnv(conteudoEnv, 'ADMIN_PASSWORD', senha)
fs.writeFileSync(caminhoEnv, conteudoEnv.endsWith('\n') ? conteudoEnv : `${conteudoEnv}\n`, { mode: 0o600 })

process.env.ADMIN_EMAIL = email
process.env.ADMIN_PASSWORD = senha
require('./iniciarBanco')

console.log(`E-mail do administrador: ${email}`)
console.log('A senha está em api/.env (ADMIN_PASSWORD). Esse arquivo não é enviado ao GitHub.')
