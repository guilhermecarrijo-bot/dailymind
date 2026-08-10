const banco = require('./src/config/conexaoBanco')

// Cria todas as tabelas necessárias para o DailyMind
banco.exec(`
  -- Tabela de usuários
  CREATE TABLE IF NOT EXISTS usuarios (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    nome            TEXT    NOT NULL,
    email           TEXT    NOT NULL UNIQUE,
    senha           TEXT    NOT NULL,
    idade           INTEGER DEFAULT NULL,
    ocupacao         TEXT    DEFAULT NULL,
    data_cadastro   TEXT    DEFAULT (datetime('now','localtime'))
  );

  -- Tabela de registros de humor
  CREATE TABLE IF NOT EXISTS humor (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id      INTEGER NOT NULL,
    emoji           TEXT    NOT NULL,
    data_registro   TEXT    DEFAULT (date('now','localtime')),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  );

  -- Tabela de registros de sono
  CREATE TABLE IF NOT EXISTS sono (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id      INTEGER NOT NULL,
    horas_sono      REAL    NOT NULL,
    qualidade        INTEGER DEFAULT 5,
    data_registro   TEXT    DEFAULT (date('now','localtime')),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  );

  -- Tabela de registros de energia
  CREATE TABLE IF NOT EXISTS energia (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id      INTEGER NOT NULL,
    nivel_energia   INTEGER NOT NULL,
    data_registro   TEXT    DEFAULT (date('now','localtime')),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  );

  -- Tabela de lembretes
  CREATE TABLE IF NOT EXISTS lembretes (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id      INTEGER NOT NULL,
    titulo          TEXT    NOT NULL,
    icone           TEXT    DEFAULT '📌',
    horario         TEXT    DEFAULT NULL,
    concluido       INTEGER DEFAULT 0,
    data_criacao    TEXT    DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  );

  -- Tabela de sugestões de autocuidado
  CREATE TABLE IF NOT EXISTS sugestoes (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    humor_tipo      TEXT    NOT NULL,
    titulo          TEXT    NOT NULL,
    descricao       TEXT    NOT NULL,
    icone           TEXT    DEFAULT '💡'
  );
`);

// Cria índices
banco.exec(`
  CREATE INDEX IF NOT EXISTS idx_humor_usuario ON humor(usuario_id);
  CREATE INDEX IF NOT EXISTS idx_humor_data ON humor(data_registro);
  CREATE INDEX IF NOT EXISTS idx_sono_usuario ON sono(usuario_id);
  CREATE INDEX IF NOT EXISTS idx_sono_data ON sono(data_registro);
  CREATE INDEX IF NOT EXISTS idx_energia_usuario ON energia(usuario_id);
  CREATE INDEX IF NOT EXISTS idx_energia_data ON energia(data_registro);
  CREATE INDEX IF NOT EXISTS idx_lembretes_usuario ON lembretes(usuario_id);
  CREATE INDEX IF NOT EXISTS idx_sugestoes_humor ON sugestoes(humor_tipo);
`);

// Insere sugestões padrão de autocuidado
const sugestoesExistentes = banco.prepare('SELECT COUNT(*) AS total FROM sugestoes').get()
if (sugestoesExistentes.total === 0) {
  const inserirSugestao = banco.prepare(
    'INSERT INTO sugestoes (humor_tipo, titulo, descricao, icone) VALUES (?, ?, ?, ?)'
  )

  const sugestoesPadrao = [
    ['feliz', 'Continue assim!', 'Que bom que está bem! Aproveite o dia para fazer algo que gosta.', '😊'],
    ['feliz', 'Compartilhe sua alegria', 'Ligue para um amigo ou familiar e espalhe essa energia boa!', '📞'],
    ['triste', 'Tomar um chá quente', 'Um chá quente pode ajudar a relaxar e confortar. Tente camomila ou cidreira.', '🍵'],
    ['triste', 'Ouvir música relaxante', 'Coloque uma playlist suave e deixe a música acalmar sua mente.', '🎵'],
    ['ansioso', 'Meditar por 5 minutos', 'Feche os olhos, respire fundo e foque na sua respiração por 5 minutos.', '🧘'],
    ['ansioso', 'Praticar respiração 4-7-8', 'Inspire por 4 segundos, segure por 7, expire por 8. Repita 3 vezes.', '🌬️'],
    ['cansado', 'Fazer uma pausa', 'Respire ar puro por alguns minutos. Uma pequena caminhada pode ajudar.', '🚶'],
    ['cansado', 'Alongar o corpo', 'Faça alguns alongamentos simples para relaxar os músculos.', '🤸'],
    ['irritado', 'Escrever seus sentimentos', 'Anote o que está sentindo. Escrever ajuda a organizar os pensamentos.', '📝'],
    ['irritado', 'Tomar um banho relaxante', 'Um banho morno pode ajudar a acalmar a mente e o corpo.', '🚿'],
    ['neutro', 'Planejar o resto do dia', 'Aproveite para organizar suas próximas atividades.', '📋'],
    ['neutro', 'Beber água', 'Manter-se hidratado é essencial para o bom funcionamento do corpo.', '💧']
  ]

  const inserirEmLote = banco.transaction((items) => {
    for (const [humor, titulo, descricao, icone] of items) {
      inserirSugestao.run(humor, titulo, descricao, icone)
    }
  })

  inserirEmLote(sugestoesPadrao)
  console.log('Sugestões de autocuidado inseridas com sucesso.')
}

console.log('Banco de dados do DailyMind inicializado com sucesso.')
