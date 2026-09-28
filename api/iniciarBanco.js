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
    objeto_deixado  TEXT    DEFAULT NULL,
    hora_deixado    TEXT    DEFAULT NULL,
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

  -- Tabela de tarefas (checklist)
  CREATE TABLE IF NOT EXISTS tarefas (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id      INTEGER NOT NULL,
    titulo          TEXT    NOT NULL,
    descricao       TEXT    DEFAULT NULL,
    icone           TEXT    DEFAULT '✓',
    concluido       INTEGER DEFAULT 0,
    data_criacao    TEXT    DEFAULT (datetime('now','localtime')),
    data_conclusao  TEXT    DEFAULT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  );

  -- Tabela de metas (objetivos com período definido)
  CREATE TABLE IF NOT EXISTS metas (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id      INTEGER NOT NULL,
    titulo          TEXT    NOT NULL,
    descricao       TEXT    DEFAULT NULL,
    icone           TEXT    DEFAULT '🎯',
    data_inicio     TEXT    NOT NULL,
    data_fim        TEXT    NOT NULL,
    progresso       INTEGER DEFAULT 0,
    status          TEXT    DEFAULT 'não_iniciada',
    data_criacao    TEXT    DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  );
`);

banco.exec(`
  CREATE TABLE IF NOT EXISTS sessoes (
    id              TEXT PRIMARY KEY,
    usuario_id      INTEGER NOT NULL,
    token_hash      TEXT    NOT NULL,
    expira_em       TEXT    NOT NULL,
    criada_em       TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_sessoes_usuario ON sessoes(usuario_id);
`)

// Campos opcionais adicionados depois da primeira versão do perfil.
for (const coluna of [
  ['bio', 'TEXT DEFAULT NULL'],
  ['foto_perfil', 'TEXT DEFAULT NULL'],
  ['banner_perfil', 'TEXT DEFAULT NULL']
]) {
  try {
    banco.exec(`ALTER TABLE usuarios ADD COLUMN ${coluna[0]} ${coluna[1]}`)
  } catch (erro) {
    if (!erro.message.includes('duplicate column name')) throw erro
  }
}

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
  CREATE INDEX IF NOT EXISTS idx_tarefas_usuario ON tarefas(usuario_id);
  CREATE INDEX IF NOT EXISTS idx_tarefas_conclusao ON tarefas(concluido);
  CREATE INDEX IF NOT EXISTS idx_metas_usuario ON metas(usuario_id);
  CREATE INDEX IF NOT EXISTS idx_metas_status ON metas(status);
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

// Acrescenta variedade sem duplicar sugestões em bancos já existentes.
const sugestoesAdicionais = [
  ['feliz', 'Guardar um momento bom', 'Anote uma coisa simples que fez seu dia melhor para lembrar depois.', '🌱'],
  ['feliz', 'Fazer algo que dá prazer', 'Reserve alguns minutos para uma atividade que você gosta.', '🎨'],
  ['triste', 'Mandar uma mensagem simples', 'Escreva para alguém de confiança apenas dizendo como você está.', '💬'],
  ['triste', 'Escolher um cuidado possível', 'Escolha uma coisa pequena e gentil para fazer por você agora.', '🫖'],
  ['ansioso', 'Reduzir os estímulos por alguns minutos', 'Se puder, escolha um lugar mais silencioso ou com uma luz mais confortável.', '🎧'],
  ['ansioso', 'Escolher um ponto de conforto', 'Ajuste uma coisa ao seu redor que possa deixar este momento mais suportável.', '🪟'],
  ['ansioso', 'Usar um apoio sensorial conhecido', 'Se você já sabe que algo ajuda, experimente esse recurso no seu ritmo.', '🧸'],
  ['ansioso', 'Dividir o próximo passo', 'Escolha apenas uma ação pequena para fazer agora. O restante pode esperar.', '🪜'],
  ['cansado', 'Escolher uma tarefa essencial', 'Defina só uma prioridade possível e deixe o restante para depois.', '✅'],
  ['cansado', 'Descansar sem culpa', 'Faça uma pausa real, mesmo que sejam apenas alguns minutos.', '🛋️'],
  ['irritado', 'Afastar-se do estímulo', 'Se puder, mude de ambiente por alguns minutos antes de decidir o que fazer.', '🚪'],
  ['irritado', 'Escrever o que precisa mudar', 'Coloque no papel o que incomodou e escolha apenas o próximo passo.', '✍️'],
  ['neutro', 'Escolher uma prioridade pequena', 'Selecione uma tarefa curta para dar direção ao restante do dia.', '🧭'],
  ['neutro', 'Observar como seu corpo está', 'Perceba sua respiração, tensão e energia sem precisar mudar nada agora.', '👀']
]

const verificarSugestao = banco.prepare('SELECT id FROM sugestoes WHERE titulo = ? LIMIT 1')
const inserirSugestaoAdicional = banco.prepare(
  'INSERT INTO sugestoes (humor_tipo, titulo, descricao, icone) VALUES (?, ?, ?, ?)'
)
const inserirAdicionaisEmLote = banco.transaction((items) => {
  for (const item of items) {
    if (!verificarSugestao.get(item[1])) inserirSugestaoAdicional.run(...item)
  }
})
inserirAdicionaisEmLote(sugestoesAdicionais)

console.log('Banco de dados do DailyMind inicializado com sucesso.')
