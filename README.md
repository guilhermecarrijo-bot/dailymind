# DailyMind - Landing Page de Pré-Cadastro

> **Projeto Acadêmico:** Aplicação Full Stack para captura de pré-cadastros do app DailyMind — uma plataforma de autocuidado para pessoas neurodivergentes.

---

## Sobre o Projeto

O **DailyMind** é um aplicativo de autocuidado pensado para pessoas com dificuldades de organização e divergências cognitivas, como TDAH, autismo ou outros perfis neurodivergentes. Esta landing page permite o pré-cadastro de interessados no aplicativo.

### Problema Identificado

Muitas pessoas neurodivergentes enfrentam desafios para manter em ordem sua rotina diária. Tarefas importantes como beber água, se alimentar, estudar e cumprir compromissos acabam sendo esquecidas, gerando desânimo e prejudicando o desempenho nos estudos e autocuidado.

### Solução Proposta

O DailyMind oferece uma solução simples que ajuda a organizar a rotina com lembretes leves, registro de humor, sono e nível de energia, permitindo que a pessoa perceba mudanças no próprio comportamento ao longo do tempo.

---

## Funcionalidades do Aplicativo

- **Cadastro Simplificado** — Criação de conta com e-mail e senha rápidos
- **Registro de Humor** — Escolha de emojis para registrar emoções diárias
- **Horas de Sono** — Registro de qualidade e horas de sono
- **Nível de Energia** — Acompanhamento do nível de energia diário
- **Lembretes Diários** — Criação de lembretes para hábitos importantes
- **Gráficos de Evolução** — Visualização mensal de humor e sono
- **Sugestões Personalizadas** — Recomendações de autocuidado baseadas no humor
- **Notificações Discretas** — Badges e alertas sem pressão

---

## Tecnologias Utilizadas

### Backend (API RESTful)
- **Node.js** — Ambiente de execução JavaScript no servidor
- **Express.js** — Framework web minimalista para rotas e middlewares
- **node:sqlite** — Driver síncrono nativo para banco SQLite
- **Helmet** — Middleware para cabeçalhos de segurança HTTP
- **CORS** — Habilitação de Cross-Origin Resource Sharing
- **Validator** — Lib para sanitização e validação de entradas
- **Dotenv** — Gerenciamento de variáveis de ambiente

### Frontend (Interface do Usuário)
- **HTML5 Semântico** — Marcação acessível e estruturada
- **Tailwind CSS** — Framework CSS utilitário para design responsivo
- **JavaScript ES6+ (Vanilla)** — Lógica do cliente e chamadas assíncronas via Fetch

### Banco de Dados
- **SQLite** — Banco de dados leve e local

---

## Estrutura do Projeto

```text
dailymind/
├── api/                          # Servidor Backend em Node.js
│   ├── db/                       # Banco de dados SQLite (criado em runtime)
│   │   └── landing.db            # Arquivo da base de dados local
│   ├── src/
│   │   ├── config/
│   │   │   └── conexaoBanco.js   # Inicialização e conexão do SQLite
│   │   ├── controladores/
│   │   │   └── leadControlador.js# Regras de negócio da API
│   │   ├── rotas/
│   │   │   └── leadRotas.js      # Endpoints da aplicação
│   │   ├── utilitarios/
│   │   │   └── validadores.js    # Sanitização e validação dos inputs
│   │   ├── app.js                # Configuração do Express e Middlewares
│   │   └── server.js             # Inicialização da porta e servidor
│   ├── .env                      # Variáveis de ambiente
│   ├── iniciarBanco.js           # DDL de criação da tabela de leads
│   └── package.json              # Dependências e scripts do Node.js
│
├── frontend/                     # Interface Web (Landing Page)
│   ├── css/
│   │   └── estilo.css            # Estilos CSS adicionais
│   ├── js/
│   │   └── app.js                # Script client-side (máscaras e Fetch API)
│   └── index.html                # Estrutura visual da Landing Page
│
├── doc/                          # Documentação do projeto
│   └── descricao_projeto/        # Documentos de descrição e requisitos
│
├── .gitignore                    # Arquivos ignorados pelo Git
└── README.md                     # Documentação oficial do repositório
```

---

## Modelagem do Banco de Dados (SQLite)

### Tabela `leads`

```sql
CREATE TABLE IF NOT EXISTS leads (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_completo       TEXT    NOT NULL,
    email               TEXT    NOT NULL,
    telefone_whatsapp   TEXT    NOT NULL,
    mensagem            TEXT    DEFAULT NULL,
    data_cadastro       TEXT    DEFAULT (datetime('now','localtime')),
    status_atendimento  TEXT    DEFAULT 'novo'
                                CHECK(status_atendimento IN ('novo','contatado','convertido','perdido'))
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status_atendimento);
```

---

## Endpoints da API

| Método | Endpoint | Descrição | Payload (Body) |
|---|---|---|---|
| `GET` | `/` | Servidor estático da Landing Page | — |
| `GET` | `/api/health` | Health Check da API | — |
| `POST` | `/api/leads` | Cadastra um novo pré-cadastro | JSON (nome, email, telefone, mensagem) |
| `GET` | `/api/leads` | Lista todos os pré-cadastrados | — |

### Exemplo de Requisição `POST /api/leads`

**Body (JSON):**
```json
{
  "nome_completo": "Maria Silva",
  "email": "maria.silva@exemplo.com",
  "telefone_whatsapp": "(11) 98888-7777",
  "mensagem": "Tenho TDAH e preciso de ajuda com organização."
}
```

**Resposta de Sucesso (HTTP 201):**
```json
{
  "sucesso": true,
  "mensagem": "Os dados do formulário foram enviados com sucesso!"
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

3. **Acesse a aplicação no navegador:**
   - **Landing Page:** [http://localhost:3000/](http://localhost:3000/)
   - **Health Check da API:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

### Parar o Servidor
- Pressione **Ctrl + C** no terminal

---

## Segurança e Boas Práticas

- **Prepared Statements:** Uso de consultas preparadas para prevenir SQL Injection
- **Sanitização de Entradas:** Limpeza de strings com a biblioteca `validator`
- **Proteção contra Payload Abusivo:** Middleware com limite de `10kb` por requisição
- **Respostas Padronizadas:** Tratamento de erros com códigos HTTP semânticos

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
