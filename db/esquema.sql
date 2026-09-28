PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL CHECK (length(trim(nome)) BETWEEN 1 AND 100),
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  senha TEXT NOT NULL CHECK (length(senha) = 64),
  idade INTEGER CHECK (idade IS NULL OR idade BETWEEN 1 AND 150),
  ocupacao TEXT CHECK (ocupacao IS NULL OR length(trim(ocupacao)) <= 100),
  bio TEXT,
  foto_perfil TEXT,
  banner_perfil TEXT,
  data_cadastro TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS sessoes (
  id              TEXT PRIMARY KEY,
  usuario_id      INTEGER NOT NULL,
  token_hash      TEXT    NOT NULL,
  expira_em       TEXT    NOT NULL,
  criada_em       TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessoes_usuario ON sessoes(usuario_id);

CREATE TABLE IF NOT EXISTS humor (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  emoji TEXT NOT NULL CHECK (emoji IN ('feliz', 'triste', 'ansioso', 'cansado', 'irritado', 'neutro')),
  data_registro TEXT NOT NULL DEFAULT (date('now', 'localtime')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE (usuario_id, data_registro)
);

CREATE TABLE IF NOT EXISTS sono (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  horas_sono REAL NOT NULL CHECK (horas_sono BETWEEN 0 AND 24),
  qualidade INTEGER NOT NULL DEFAULT 5 CHECK (qualidade BETWEEN 1 AND 5),
  data_registro TEXT NOT NULL DEFAULT (date('now', 'localtime')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE (usuario_id, data_registro)
);

CREATE TABLE IF NOT EXISTS energia (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  nivel_energia INTEGER NOT NULL CHECK (nivel_energia BETWEEN 1 AND 10),
  data_registro TEXT NOT NULL DEFAULT (date('now', 'localtime')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE (usuario_id, data_registro)
);

CREATE TABLE IF NOT EXISTS lembretes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  titulo TEXT NOT NULL CHECK (length(trim(titulo)) BETWEEN 1 AND 150),
  icone TEXT NOT NULL DEFAULT '📌',
  horario TEXT,
  objeto_deixado TEXT,
  hora_deixado TEXT,
  concluido INTEGER NOT NULL DEFAULT 0 CHECK (concluido IN (0, 1)),
  data_criacao TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sugestoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  humor_tipo TEXT NOT NULL CHECK (humor_tipo IN ('feliz', 'triste', 'ansioso', 'cansado', 'irritado', 'neutro')),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  icone TEXT NOT NULL DEFAULT '💡'
);

CREATE TABLE IF NOT EXISTS tarefas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  titulo TEXT NOT NULL CHECK (length(trim(titulo)) BETWEEN 1 AND 200),
  descricao TEXT,
  icone TEXT NOT NULL DEFAULT '✓',
  concluido INTEGER NOT NULL DEFAULT 0 CHECK (concluido IN (0, 1)),
  data_criacao TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  data_conclusao TEXT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS metas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  titulo TEXT NOT NULL CHECK (length(trim(titulo)) BETWEEN 1 AND 200),
  descricao TEXT,
  icone TEXT NOT NULL DEFAULT '🎯',
  data_inicio TEXT NOT NULL,
  data_fim TEXT NOT NULL,
  progresso INTEGER NOT NULL DEFAULT 0 CHECK (progresso BETWEEN 0 AND 100),
  status TEXT NOT NULL DEFAULT 'não_iniciada' CHECK (status IN ('não_iniciada', 'em_andamento', 'concluida')),
  data_criacao TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CHECK (date(data_fim) > date(data_inicio))
);

CREATE INDEX IF NOT EXISTS idx_humor_usuario_data ON humor(usuario_id, data_registro DESC);
CREATE INDEX IF NOT EXISTS idx_sono_usuario_data ON sono(usuario_id, data_registro DESC);
CREATE INDEX IF NOT EXISTS idx_energia_usuario_data ON energia(usuario_id, data_registro DESC);
CREATE INDEX IF NOT EXISTS idx_lembretes_usuario ON lembretes(usuario_id, concluido);
CREATE INDEX IF NOT EXISTS idx_sugestoes_humor ON sugestoes(humor_tipo);
CREATE INDEX IF NOT EXISTS idx_tarefas_usuario ON tarefas(usuario_id, concluido, data_criacao);
CREATE INDEX IF NOT EXISTS idx_metas_usuario ON metas(usuario_id, status, data_fim);
