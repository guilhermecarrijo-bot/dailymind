const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const repositorio = require('./src/repositorio')
const banco = require('./src/config/conexaoBanco')
const configuracao = require('./src/config/ambiente')

const scrypt = promisify(crypto.scrypt)
const PARAMETROS_SCRYPT = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }
const caminhoEnv = path.join(__dirname, '.env')

function atualizarEnv(conteudo, chave, valor) {
  const linhas = conteudo.split(/\r?\n/)
  const expressao = new RegExp(`^${chave}\\s*=.*$`)
  const encontrados = linhas.reduce((indices, linha, indice) => {
    if (expressao.test(linha)) indices.push(indice)
    return indices
  }, [])

  if (!encontrados.length) {
    linhas.push(`${chave}=${valor}`)
  } else {
    for (const indice of encontrados) linhas[indice] = `${chave}=${valor}`
  }
  return linhas.join('\n')
}

async function hashSenha(senha) {
  const salt = crypto.randomBytes(16)
  const hash = await scrypt(senha, salt, 64, PARAMETROS_SCRYPT)
  return `scrypt$${PARAMETROS_SCRYPT.N}$${PARAMETROS_SCRYPT.r}$${PARAMETROS_SCRYPT.p}$${salt.toString('hex')}$${hash.toString('hex')}`
}

async function configurarAdministrador() {
  const colunas = new Set(banco.pragma('table_info(usuarios)').map(coluna => coluna.name))
  for (const coluna of ['id', 'nome', 'email', 'senha']) {
    if (!colunas.has(coluna)) throw new Error(`A tabela usuarios não possui a coluna obrigatória ${coluna}.`)
  }

  const email = configuracao.adminEmail.trim().toLowerCase()
  const rotacionarSenha = process.argv.includes('--rotate')
  const senha = !rotacionarSenha && process.env.ADMIN_PASSWORD
    ? process.env.ADMIN_PASSWORD
    : crypto.randomBytes(24).toString('base64url')
  const senhaHash = await hashSenha(senha)
  let conteudoEnv = fs.existsSync(caminhoEnv) ? fs.readFileSync(caminhoEnv, 'utf8') : ''
  conteudoEnv = atualizarEnv(conteudoEnv, 'ADMIN_EMAIL', email)
  conteudoEnv = atualizarEnv(conteudoEnv, 'ADMIN_PASSWORD', senha)
  fs.writeFileSync(caminhoEnv, conteudoEnv.endsWith('\n') ? conteudoEnv : `${conteudoEnv}\n`, { mode: 0o600 })
  fs.chmodSync(caminhoEnv, 0o600)

  const dados = { senha: senhaHash }
  if (colunas.has('role')) dados.role = 'admin'
  if (colunas.has('ativo')) dados.ativo = 1
  const existente = banco.prepare('SELECT id FROM usuarios WHERE lower(email) = lower(?)').get(email)

  banco.transaction(() => {
    if (existente) {
      repositorio.atualizar('usuarios', existente.id, dados)
    } else {
      repositorio.criar('usuarios', {
        nome: 'Administrador DailyMind',
        email,
        senha: senhaHash,
        ...(colunas.has('ocupacao') ? { ocupacao: 'Administrador' } : {}),
        ...(colunas.has('role') ? { role: 'admin' } : {}),
        ...(colunas.has('ativo') ? { ativo: 1 } : {})
      })
    }
  })()

  console.log(`Acesso administrativo configurado para ${email}.`)
  console.log('A senha foi salva em api/.env (ADMIN_PASSWORD); ela não é exibida nem versionada.')
  if (!colunas.has('role')) {
    console.log('O papel admin é reconhecido pelo e-mail configurado porque o schema atual não tem coluna role.')
  }
  if (!colunas.has('ativo')) {
    console.log('Desativação de contas pelo painel requer uma coluna ativo, ausente no schema atual.')
  }
}

configurarAdministrador()
  .catch(erro => {
    console.error('Não foi possível configurar o administrador:', erro.message)
    process.exitCode = 1
  })
  .finally(() => banco.close())