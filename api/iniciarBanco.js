const banco = require('./src/config/conexaoBanco')

banco.exec(`
  CREATE TABLE IF NOT EXISTS USUARIO (
    id_usuario      INTEGER PRIMARY KEY AUTOINCREMENT,
    nome            TEXT    NOT NULL,
    email           TEXT    NOT NULL UNIQUE,
    senha           TEXT    NOT NULL,
    tipo_usuario    TEXT    NOT NULL DEFAULT 'usuário'
  );

  CREATE TABLE IF NOT EXISTS TAREFA (
    id_tarefa       INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario      INTEGER NOT NULL,
    titulo          TEXT    NOT NULL,
    descricao       TEXT    DEFAULT NULL,
    data            TEXT    DEFAULT (date('now','localtime')),
    horario         TEXT    DEFAULT NULL,
    categoria       TEXT    DEFAULT NULL,
    concluida       INTEGER DEFAULT 0,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS HUMOR (
    id_humor        INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario      INTEGER NOT NULL,
    data            TEXT    DEFAULT (date('now','localtime')),
    humor           TEXT    NOT NULL,
    intensidade     INTEGER NOT NULL,
    observacao      TEXT    DEFAULT NULL,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS SONO (
    id_sono         INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario      INTEGER NOT NULL,
    data            TEXT    DEFAULT (date('now','localtime')),
    horas_dormidas  REAL    NOT NULL,
    qualidade       INTEGER DEFAULT 5,
    observacao      TEXT    DEFAULT NULL,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS ENERGIA (
    id_energia      INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario      INTEGER NOT NULL,
    data            TEXT    DEFAULT (date('now','localtime')),
    nivel           INTEGER NOT NULL,
    observacao      TEXT    DEFAULT NULL,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS META (
    id_meta         INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario      INTEGER NOT NULL,
    titulo          TEXT    NOT NULL,
    descricao       TEXT    DEFAULT NULL,
    data_inicio     TEXT    DEFAULT (date('now','localtime')),
    data_fim        TEXT    DEFAULT NULL,
    concluida       INTEGER DEFAULT 0,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
  );
`)

banco.exec(`
  CREATE INDEX IF NOT EXISTS idx_tarefa_usuario ON TAREFA(id_usuario);
  CREATE INDEX IF NOT EXISTS idx_humor_usuario ON HUMOR(id_usuario);
  CREATE INDEX IF NOT EXISTS idx_humor_data ON HUMOR(data);
  CREATE INDEX IF NOT EXISTS idx_sono_usuario ON SONO(id_usuario);
  CREATE INDEX IF NOT EXISTS idx_sono_data ON SONO(data);
  CREATE INDEX IF NOT EXISTS idx_energia_usuario ON ENERGIA(id_usuario);
  CREATE INDEX IF NOT EXISTS idx_energia_data ON ENERGIA(data);
  CREATE INDEX IF NOT EXISTS idx_meta_usuario ON META(id_usuario);
`)

console.log('Banco de dados do DailyMind inicializado com sucesso.')
