# DailyMind - App de Autocuidado para Neurodivergentes

> **Projeto Acadêmico:** Aplicação Full Stack de autocuidado para pessoas neurodivergentes, com registro de humor, sono, energia, lembretes diários e sugestões personalizadas.

---

## Sobre o Projeto

O **DailyMind** é um aplicativo de autocuidado pensado para pessoas com dificuldades de organização e divergências cognitivas, como **TDAH, autismo** ou outros perfis neurodivergentes. O sistema conta com uma **área autenticada** (cadastro/login), um **dashboard** diário e gráficos de evolução, ajudando o usuário a perceber mudanças no próprio comportamento ao longo do tempo.

### Problema Identificado

Muitas pessoas neurodivergentes enfrentam desafios para manter em ordem sua rotina diária. Tarefas importantes como beber água, se alimentar, estudar e cumprir compromissos acabam sendo esquecidas, gerando desânimo e prejudicando o desempenho nos estudos e no autocuidado.

### Solução Proposta

O DailyMind oferece uma solução simples que ajuda a organizar a rotina com **lembretes leves**, **registro de humor**, **sono** e **nível de energia**, com **notificações discretas** (badge) e **sugestões de autocuidado** baseadas no humor do dia — tudo em uma interface acolhedora, sem pressão.

---

## Funcionalidades do Sistema

### Autenticação e Perfil
- **Cadastro de conta** — Criação de conta com nome, e-mail, senha, idade e ocupação
- **Login / Logout** — Sessão persistida no `localStorage`
- **Edição de perfil** — Atualização de nome, idade e ocupação

### Registro Diário
- **Humor** — Registro de emoção do dia via emojis (😊 😔 😰 😫 😤 😐 ...), atualizado automaticamente se já registrado no dia
- **Sono** — Registro de horas de sono (0–24h) e qualidade
- **Energia** — Registro do nível de energia de 1 a 10

### Lembretes Diários
- **Criação** — Lembrete com título e ícone (📌 ⏰ 💧 🍎 📖 ...)
- **Concluir / Reabrir** — Marcação de lembretes como concluídos
- **Remoção** — Exclusão de lembretes
- **Badge de pendentes** — Contador de tarefas em aberto na barra de navegação

### Inteligência e Visualização
- **Sugestões personalizadas** — Recomendações de autocuidado baseadas no humor do dia
- **Gráficos de evolução** — Visualização mensal de humor (linha) e sono (barras) com **Chart.js**
- **Notificações discretas** — Badge de alertas sem pressão

---

## Tecnologias Utilizadas

### Backend (API RESTful)
- **Node.js** — Ambiente de execução JavaScript no servidor
- **Express.js** — Framework web minimalista para rotas e middlewares
- **better-sqlite3** — Driver síncrono e performático para SQLite
- **Helmet** — Middleware para cabeçalhos de segurança HTTP
- **CORS** — Habilitação de Cross-Origin Resource Sharing
- **Validator** — Lib para sanitização e validação de entradas
- **Dotenv** — Gerenciamento de variáveis de ambiente
- **crypto** — Hash de senhas (SHA-256, para fins de demonstração)

### Frontend (Interface do Usuário)
- **HTML5 Semântico** — Marcação acessível e estruturada
- **Tailwind CSS** — Framework CSS utilitário (CDN) para design responsivo
- **JavaScript ES6+ (Vanilla)** — Lógica do cliente e chamadas assíncronas via Fetch
- **Chart.js** — Biblioteca de gráficos para a evolução de humor e sono

### Banco de Dados
- **SQLite** — Banco de dados leve e local (modo WAL ativo)

---

## Estrutura do Projeto

```text
dailymind/
├── api/                            # Servidor Backend em Node.js
│   ├── db/                         # Banco de dados SQLite (criado em runtime)
│   │   └── dailymind.db            # Arquivo da base de dados local
│   ├── src/
│   │   ├── config/
│   │   │   └── conexaoBanco.js     # Conexão e configuração do SQLite (WAL)
│   │   ├── controladores/
│   │   │   ├── usuarioControlador.js # Cadastro, login e perfil de usuários
│   │   │   ├── humorControlador.js   # Registro e consulta de humor
│   │   │   ├── sonoControlador.js    # Registro e consulta de sono
│   │   │   ├── energiaControlador.js # Registro e consulta de energia
│   │   │   ├── lembreteControlador.js# CRUD de lembretes e badge de pendentes
│   │   │   ├── sugestaoControlador.js# Sugestões de autocuidado por humor
│   │   │   └── leadControlador.js    # Módulo legado de pré-cadastro (lead)
│   │   ├── rotas/
│   │   │   ├── dailyMindRotas.js   # Endpoints ativos da aplicação
│   │   │   └── leadRotas.js        # Rotas legadas de leads (não montadas)
│   │   ├── utilitarios/
│   │   │   └── validadores.js      # Sanitização e validação dos inputs
│   │   ├── app.js                  # Configuração do Express e Middlewares
│   │   └── server.js               # Inicialização da porta e servidor
│   ├── .env                        # Variáveis de ambiente
│   ├── iniciarBanco.js             # DDL das tabelas + dados padrão
│   └── package.json                # Dependências e scripts do Node.js
│
├── frontend/                       # Interface Web (SPA)
│   ├── css/
│   │   └── estilo.css              # Estilos CSS adicionais
│   ├── js/
│   │   └── app.js                  # Lógica da aplicação (auth, APIs e gráficos)
│   └── index.html                  # Telas da aplicação (login, dashboard, etc.)
│
├── doc/                            # Documentação do projeto
│   └── descricao_projeto/          # Documentos de descrição e requisitos
│
├── .gitignore                      # Arquivos ignorados pelo Git
└── README.md                       # Documentação oficial do repositório
```

---

## Modelagem do Banco de Dados (SQLite)

### Tabela `usuarios`

```sql
CREATE TABLE IF NOT EXISTS usuarios (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    nome            TEXT    NOT NULL,
    email           TEXT    NOT NULL UNIQUE,
    senha           TEXT    NOT NULL,
    idade           INTEGER DEFAULT NULL,
    ocupacao        TEXT    DEFAULT NULL,
    data_cadastro   TEXT    DEFAULT (datetime('now','localtime'))
);
```

### Tabela `humor`

```sql
CREATE TABLE IF NOT EXISTS humor (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id      INTEGER NOT NULL,
    emoji           TEXT    NOT NULL,
    data_registro   TEXT    DEFAULT (date('now','localtime')),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

### Tabela `sono`

```sql
CREATE TABLE IF NOT EXISTS sono (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id      INTEGER NOT NULL,
    horas_sono      REAL    NOT NULL,
    qualidade       INTEGER DEFAULT 5,
    data_registro   TEXT    DEFAULT (date('now','localtime')),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

### Tabela `energia`

```sql
CREATE TABLE IF NOT EXISTS energia (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id      INTEGER NOT NULL,
    nivel_energia   INTEGER NOT NULL,
    data_registro   TEXT    DEFAULT (date('now','localtime')),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

### Tabela `lembretes`

```sql
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
```

### Tabela `sugestoes`

```sql
CREATE TABLE IF NOT EXISTS sugestoes (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    humor_tipo      TEXT    NOT NULL,
    titulo          TEXT    NOT NULL,
    descricao       TEXT    NOT NULL,
    icone           TEXT    DEFAULT '💡'
);
```

### Índices e Seed

O arquivo `iniciarBanco.js` cria índices para todas as tabelas e insere automaticamente **12 sugestões padrão de autocuidado** (mapping: `feliz`, `triste`, `ansioso`, `cansado`, `irritado`, `neutro`) quando a tabela `sugestoes` está vazia.

> **Obs.:** O módulo de **leads** (pré-cadastro da antiga landing page) permanece no código como legado (`leadControlador.js` / `leadRotas.js`), porém não faz mais parte do banco nem das rotas ativas.

---

## Endpoints da API

| Método | Endpoint | Descrição | Payload (Body) |
|---|---|---|---|
| `GET` | `/` | Servidor estático da aplicação (SPA) | — |
| `GET` | `/api/health` | Health Check da API | — |
| `POST` | `/api/usuarios/cadastro` | Cria uma nova conta | JSON (nome, email, senha, idade?, ocupacao?) |
| `POST` | `/api/usuarios/login` | Autentica o usuário | JSON (email, senha) |
| `PUT` | `/api/usuarios/perfil` | Atualiza dados do perfil | JSON (id, nome?, idade?, ocupacao?) |
| `POST` | `/api/humor` | Registra/atualiza humor do dia | JSON (usuario_id, emoji) |
| `GET` | `/api/humor/:usuario_id` | Lista últimos 30 registros de humor | — |
| `GET` | `/api/humor/:usuario_id/hoje` | Obtém humor de hoje | — |
| `POST` | `/api/sono` | Registra/atualiza sono do dia | JSON (usuario_id, horas_sono, qualidade?) |
| `GET` | `/api/sono/:usuario_id` | Lista últimos 30 registros de sono | — |
| `GET` | `/api/sono/:usuario_id/hoje` | Obtém sono de hoje | — |
| `POST` | `/api/energia` | Registra/atualiza energia do dia | JSON (usuario_id, nivel_energia) |
| `GET` | `/api/energia/:usuario_id` | Lista últimos 30 registros de energia | — |
| `GET` | `/api/energia/:usuario_id/hoje` | Obtém energia de hoje | — |
| `POST` | `/api/lembretes` | Cria um novo lembrete | JSON (usuario_id, titulo, icone?, horario?) |
| `GET` | `/api/lembretes/:usuario_id` | Lista lembretes do usuário | — |
| `PUT` | `/api/lembretes/:id/toggle` | Alterna lembrete entre concluído/pendente | — |
| `DELETE` | `/api/lembretes/:id` | Remove um lembrete | — |
| `GET` | `/api/lembretes/:usuario_id/pendentes` | Conta lembretes pendentes (badge) | — |
| `GET` | `/api/sugestoes/:usuario_id` | Sugestões de autocuidado do humor de hoje | — |
| `GET` | `/api/sugestoes` | Lista todas as sugestões cadastradas | — |

### Exemplo de Requisição `POST /api/usuarios/cadastro`

**Body (JSON):**
```json
{
  "nome": "Maria Silva",
  "email": "maria.silva@exemplo.com",
  "senha": "123456",
  "idade": 25,
  "ocupacao": "Estudante"
}
```

**Resposta de Sucesso (HTTP 201):**
```json
{
  "sucesso": true,
  "mensagem": "Conta criada com sucesso!",
  "usuario": { "id": 1, "nome": "Maria Silva", "email": "maria.silva@exemplo.com" }
}
```

### Exemplo de Requisição `POST /api/humor`

**Body (JSON):**
```json
{
  "usuario_id": 1,
  "emoji": "😊"
}
```

**Resposta de Sucesso (HTTP 201):**
```json
{
  "sucesso": true,
  "mensagem": "Humor registrado!",
  "id": 1
}
```

---

## Como Executar o Projeto

### Pré-requisitos
- **Node.js** (v18 ou superior) e **npm** instalados

### Iniciar o Projeto

1. **Navegue até a pasta `api` e instale as dependências:**
   ```bash
   cd api
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

   > O servidor executa automaticamente o script `iniciarBanco.js`, criando as tabelas e os dados padrão do banco.

3. **Acesse a aplicação no navegador:**
   - **Aplicação (SPA):** [http://localhost:3000/](http://localhost:3000/)
   - **Health Check da API:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

### Parar o Servidor
- Pressione **Ctrl + C** no terminal

---

## Segurança e Boas Práticas

- **Prepared Statements:** Uso de consultas preparadas para prevenir SQL Injection
- **Hash de Senhas:** Senhas armazenadas com hash SHA-256 (crypto)
- **Sanitização de Entradas:** Limpeza de strings com a biblioteca `validator` (módulo de leads)
- **Proteção contra Payload Abusivo:** Middleware com limite de `10kb` por requisição
- **Cabeçalhos de Segurança:** Middleware `helmet` habilitado
- **CORS configurável:** Origem permitida via variável de ambiente `ORIGEM_PERMITIDA`
- **Respostas Padronizadas:** Tratamento de erros com códigos HTTP semânticos (422, 401, 409, 404)

---

## Público-Alvo

- **Pessoas Neurodivergentes** — Pessoas com TDAH, autismo ou outras condições que dificultam a organização
- **Cuidadores e Família** — Pessoas que convivem com neurodivergentes e buscam ferramentas de apoio

---

## Licença e Créditos

Projeto desenvolvido para fins educacionais e acadêmicos.

**Integrantes:** Ana Eduarda Sousa Silva Soares, Byank Chrystinny Santana Lima, Emanuele Oliveira Andrade, Guilherme dos Santos Carrijo e Maria Eduarda Pereira Sastre.

**Disciplina:** Fábrica de Soluções Inteligentes

**Professores:** André Lôbo