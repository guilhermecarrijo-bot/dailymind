const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

// Define o arquivo SQLite e garante que sua pasta existe
const pastaDb = path.resolve(__dirname, '../../db')
const caminhoBanco = process.env.DAILYMIND_DB_PATH
	? path.resolve(process.env.DAILYMIND_DB_PATH)
	: path.join(pastaDb, 'dailymind.db')
const pastaBanco = path.dirname(caminhoBanco)
if (!fs.existsSync(pastaBanco)) fs.mkdirSync(pastaBanco, { recursive: true })

// Cria conexão com o banco SQLite
const banco = new Database(caminhoBanco)

// Ativa WAL para melhor performance
banco.pragma('journal_mode = WAL')
banco.pragma('foreign_keys = ON')

module.exports = banco
