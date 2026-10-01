const app = require('./app')
const configuracao = require('./config/ambiente')

// Inicializa a tabela no banco antes de subir o servidor
require('../iniciarBanco')

const servidor = app.listen(configuracao.porta, () => {
	console.log(`Servidor rodando na porta ${configuracao.porta}`)
})

servidor.on('error', erro => {
	if (erro.code === 'EADDRINUSE') {
		console.error(`A porta ${configuracao.porta} já está em uso. O DailyMind pode já estar aberto em outra janela.`)
		console.error(`Acesse http://localhost:${configuracao.porta} ou feche a outra instância antes de iniciar novamente.`)
		process.exit(1)
	}

	console.error('Não foi possível iniciar o servidor:', erro.message)
	process.exit(1)
})
