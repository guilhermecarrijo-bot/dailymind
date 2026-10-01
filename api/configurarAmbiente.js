const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

function configurarAmbiente(pastaApi = __dirname) {
  const caminhoEnv = path.join(pastaApi, '.env')
  const caminhoExemplo = path.join(pastaApi, '.env.example')

  if (!fs.existsSync(caminhoEnv)) {
    fs.copyFileSync(caminhoExemplo, caminhoEnv)
  }

  let conteudo = fs.readFileSync(caminhoEnv, 'utf8')
  let encontrouChave = false
  let gerouChave = false

  conteudo = conteudo.replace(/^CHAVE_SESSAO\s*=(.*)$/m, (_, valor) => {
    encontrouChave = true
    const valorAtual = valor.trim().replace(/^(["'])(.*)\1$/, '$2').trim()
    if (valorAtual) return `CHAVE_SESSAO=${valor.trim()}`

    gerouChave = true
    return `CHAVE_SESSAO=${crypto.randomBytes(48).toString('base64')}`
  })

  if (!encontrouChave) {
    const separador = conteudo.endsWith('\n') ? '' : '\n'
    conteudo += `${separador}CHAVE_SESSAO=${crypto.randomBytes(48).toString('base64')}\n`
    gerouChave = true
  }

  if (gerouChave) fs.writeFileSync(caminhoEnv, conteudo)
  return gerouChave
}

if (require.main === module) {
  const gerouChave = configurarAmbiente()
  console.log(gerouChave
    ? 'Arquivo .env preparado e chave de sessão gerada.'
    : 'Arquivo .env encontrado; chave de sessão existente preservada.')
}

module.exports = configurarAmbiente