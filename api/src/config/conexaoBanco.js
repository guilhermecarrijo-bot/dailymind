const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')
const os = require('os')
const configuracao = require('./ambiente')

const caminhoBancoExistente = path.resolve(__dirname, '../../db/dailymind.db')
const pastaDadosSistema = process.platform === 'win32'
	? process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')
	: process.platform === 'darwin'
		? path.join(os.homedir(), 'Library', 'Application Support')
		: process.env.XDG_DATA_HOME || path.join(os.homedir(), '.local', 'share')
const caminhoBancoPadrao = fs.existsSync(caminhoBancoExistente)
	? caminhoBancoExistente
	: path.join(pastaDadosSistema, 'DailyMind', 'dailymind.db')
const caminhoBanco = configuracao.caminhoBanco || caminhoBancoPadrao
const pastaBanco = path.dirname(caminhoBanco)
if (!fs.existsSync(pastaBanco)) fs.mkdirSync(pastaBanco, { recursive: true })

// Cria conexão com o banco SQLite
const banco = new Database(caminhoBanco)

// Ativa WAL para melhor performance
banco.pragma('journal_mode = WAL')
banco.pragma('foreign_keys = ON')

module.exports = banco
