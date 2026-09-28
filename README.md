# DailyMind - App de Autocuidado

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
- **Login / Logout** — Sessão HttpOnly validada e revogada pelo backend
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
- **crypto** — Hash adaptativo de senhas (scrypt), geração de tokens e HMAC de sessão

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

Todas as URLs abaixo usam o prefixo `/api`. As operações por ID exigem `id_usuario` no JSON do corpo ou na query string, garantindo que o usuário só acesse os próprios dados.

| Método | Endpoint | Descrição | Dados enviados |
|---|---|---|---|
| `GET` | `/` | Front-end servido pela API | — |
| `GET` | `/api/health` | Verifica a API | — |
| `POST` | `/api/usuarios/cadastro` | Cadastra usuário | `nome`, `email`, `senha`, `tipo_usuario?` |
| `POST` | `/api/usuarios/login` | Realiza login | `email`, `senha` |
| `GET` | `/api/usuarios/:id_usuario` | Consulta perfil | — |
| `PUT` | `/api/usuarios/perfil` | Atualiza perfil | `id_usuario`, `nome?`, `tipo_usuario?` |
| `POST` | `/api/tarefas` | Cria tarefa | `id_usuario`, `titulo`, `descricao?`, `data?`, `horario?`, `categoria?` |
| `GET` | `/api/tarefas/:id_usuario` | Lista tarefas | — |
| `GET` | `/api/tarefas/:id_usuario/:id` | Consulta tarefa | — |
| `PUT` | `/api/tarefas/:id` | Edita tarefa | `id_usuario` e campos a alterar |
| `PUT` | `/api/tarefas/:id/toggle` | Marca/reabre tarefa | `id_usuario` |
| `DELETE` | `/api/tarefas/:id` | Exclui tarefa | `id_usuario` |
| `GET` | `/api/tarefas/:id_usuario/pendentes` | Conta tarefas pendentes | — |
| `POST` | `/api/humor` | Registra/atualiza humor do dia | `id_usuario`, `data?`, `humor`, `intensidade`, `observacao?` |
| `GET` | `/api/humor/:id_usuario` | Lista humor | — |
| `GET` | `/api/humor/:id_usuario/hoje` | Consulta humor de hoje | — |
| `PUT` | `/api/humor/:id` | Edita humor | `id_usuario`, `humor`, `intensidade`, `observacao?`, `data?` |
| `DELETE` | `/api/humor/:id` | Exclui humor | `id_usuario` |
| `POST` | `/api/sono` | Registra/atualiza sono do dia | `id_usuario`, `horas_dormidas`, `qualidade?`, `observacao?` |
| `GET` | `/api/sono/:id_usuario` | Lista sono | — |
| `GET` | `/api/sono/:id_usuario/hoje` | Consulta sono de hoje | — |
| `PUT` | `/api/sono/:id` | Edita sono | `id_usuario`, `horas_dormidas`, `qualidade?`, `observacao?`, `data?` |
| `DELETE` | `/api/sono/:id` | Exclui sono | `id_usuario` |
| `POST` | `/api/energia` | Registra/atualiza energia do dia | `id_usuario`, `nivel`, `observacao?` |
| `GET` | `/api/energia/:id_usuario` | Lista energia | — |
| `GET` | `/api/energia/:id_usuario/hoje` | Consulta energia de hoje | — |
| `PUT` | `/api/energia/:id` | Edita energia | `id_usuario`, `nivel`, `observacao?`, `data?` |
| `DELETE` | `/api/energia/:id` | Exclui energia | `id_usuario` |
| `POST` | `/api/metas` | Cria meta | `id_usuario`, `titulo`, `descricao?`, `data_inicio?`, `data_fim?` |
| `GET` | `/api/metas/:id_usuario` | Lista metas | — |
| `GET` | `/api/metas/:id_usuario/:id` | Consulta meta | — |
| `PUT` | `/api/metas/:id` | Edita meta | `id_usuario` e campos a alterar |
| `PUT` | `/api/metas/:id/toggle` | Marca/reabre meta | `id_usuario` |
| `DELETE` | `/api/metas/:id` | Exclui meta | `id_usuario` |

Respostas de sucesso usam `{ "sucesso": true, ... }`. Erros usam HTTP `422` para dados inválidos, `401` para login inválido, `404` para registro inexistente e `409` para e-mail duplicado.

### Exemplo de Requisição `POST /api/usuarios/cadastro`

**Body (JSON):**
```json
{
  "nome": "Maria Silva",
  "email": "maria.silva@exemplo.com",
  "senha": "123456",
  "tipo_usuario": "usuário"
}
```

**Resposta de Sucesso (HTTP 201):**
```json
{
  "sucesso": true,
  "mensagem": "Conta criada com sucesso!",
  "usuario": { "id_usuario": 1, "nome": "Maria Silva", "email": "maria.silva@exemplo.com", "tipo_usuario": "usuário" }
}
```

### Exemplo de Requisição `POST /api/humor`

**Body (JSON):**
```json
{
  "id_usuario": 1,
  "humor": "feliz",
  "intensidade": 5,
  "observacao": "Bom dia"
}
```

**Resposta de Sucesso (HTTP 201):**
```json
{
  "sucesso": true,
  "mensagem": "Humor registrado!",
  "id_humor": 1
}
```

---

## Como Executar o Projeto

### Pré-requisitos
- **Node.js** (v22 ou superior) e **npm** instalados

### Iniciar o Projeto

1. **Navegue até a pasta `api` e instale as dependências:**
   ```bash
   cd api
   npm install
   ```

  Copie `.env.example` para `.env` e configure `CHAVE_SESSAO` com uma chave aleatória de pelo menos 32 bytes. Gere uma com `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"`; mantenha o valor apenas no `.env` local ou no gerenciador de segredos do ambiente, nunca no GitHub.

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
- **Hash de Senhas:** Senhas protegidas com scrypt e salt individual; hashes legados são atualizados no login
- **Sessões:** Token opaco em cookie HttpOnly, revogável e com expiração de sete dias
- **Segredo do Backend:** `CHAVE_SESSAO` configurada fora do código; obrigatória em produção e ignorada pelo Git
- **Autorização:** Rotas privadas restringem consultas e alterações ao usuário da sessão
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
