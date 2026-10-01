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
- **Badge de pendentes** — Contador de lembretes em aberto na barra de navegação

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
│   ├── js/
│   │   └── app.js                  # Lógica da aplicação (auth, registros, lembretes e gráficos)
│   ├── index.html                  # Telas da aplicação (login, dashboard, gráficos, lembretes e perfil)
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

Todas as rotas usam o prefixo `/api`. Cadastro, login, health check e `GET /sugestoes` são públicos; as demais exigem o cookie de sessão `HttpOnly`. O usuário é identificado pela sessão: enviar um ID no caminho ou no corpo não concede acesso a outra conta.

| Recurso | Rotas principais |
|---|---|
| Saúde e autenticação | `GET /health`, `POST /usuarios/cadastro`, `POST /usuarios/login`, `GET /usuarios/sessao`, `POST /usuarios/logout` |
| Perfil | `GET /usuarios/:id`, `PUT /usuarios/perfil` |
| Humor | `POST /humor`, `GET /humor/:usuario_id`, `GET /humor/:usuario_id/hoje`, `PUT /humor/:id`, `DELETE /humor/:id` |
| Sono | `POST /sono`, `GET /sono/:usuario_id`, `GET /sono/:usuario_id/hoje`, `PUT /sono/:id`, `DELETE /sono/:id` |
| Energia | `POST /energia`, `GET /energia/:usuario_id`, `GET /energia/:usuario_id/hoje`, `PUT /energia/:id`, `DELETE /energia/:id` |
| Lembretes | `POST /lembretes`, `GET /lembretes/:usuario_id`, `PUT /lembretes/:id/toggle`, `DELETE /lembretes/:id`, `GET /lembretes/:usuario_id/pendentes` |
| Tarefas (API) | `POST /tarefas`, `GET /tarefas/:usuario_id`, `GET /tarefas/:usuario_id/hoje`, `GET /tarefas/:usuario_id/pendentes`, `GET /tarefas/item/:id`, `PUT /tarefas/:id/toggle`, `PUT /tarefas/:id`, `DELETE /tarefas/:id` |
| Metas (API) | `POST /metas`, `GET /metas/:usuario_id`, `GET /metas/:usuario_id/ativas`, `GET /metas/:usuario_id/estatisticas`, `GET /metas/item/:id`, `PUT /metas/:id`, `PUT /metas/:id/progresso`, `DELETE /metas/:id` |
| Sugestões | `GET /sugestoes`, `GET /sugestoes/:usuario_id` |

Respostas usam JSON com `sucesso`; erros incluem `401` (sessão ausente/inválida), `403` (sem acesso ao registro), `404` (registro inexistente), `409` (e-mail duplicado) e `422` (dados inválidos). A interface atual não inclui telas de tarefas/metas; esses recursos permanecem disponíveis pela API.

O cadastro recebe `nome`, `email`, `senha` (8 a 128 caracteres) e, opcionalmente, `idade` e `ocupacao`. Após cadastro ou login, o servidor define o cookie de sessão; chamadas privadas devem mantê-lo e não precisam usar um ID como credencial.

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

2. **Configure o ambiente local:**
   ```bash
   cp .env.example .env
   node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
   ```
   Cole o valor gerado em `CHAVE_SESSAO` no arquivo `api/.env`. Esse arquivo é ignorado pelo Git; não inclua segredos no repositório. Em produção, forneça a chave pelo ambiente ou por um gerenciador de segredos.

   `api/.env.example` documenta as variáveis `NODE_ENV`, `PORT`, `ORIGEM_PERMITIDA`, `CHAVE_SESSAO` e `DAILYMIND_DB_PATH`. O banco atual é SQLite e não possui usuário ou senha de conexão; use `DAILYMIND_DB_PATH` para configurar o caminho do arquivo.

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

   > O servidor executa automaticamente o script `iniciarBanco.js`, criando as tabelas e os dados padrão do banco.

4. **Acesse a aplicação no navegador:**
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
- **Validação de Entradas:** Validação de e-mail, senha e campos de perfil nos controladores
- **Proteção contra Payload Abusivo:** Middleware JSON com limite de `12mb` por requisição
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
