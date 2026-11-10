# Prompt de Engenharia de Software: Implementação da Área Administrativa do DailyMind

Copie e cole o texto delimitado no bloco abaixo diretamente no **GitHub Copilot**, **ChatGPT** ou outra ferramenta de IA para gerar o código completo do módulo de administração.

---

```text
Você é um Engenheiro de Software Senior e Especialista em Segurança Web. Sua tarefa é criar um módulo de Área Administrativa completo para o sistema DailyMind, respeitando rigorosamente a arquitetura, stack tecnológica e padrões de segurança existentes descritos no README do projeto.

---

### 1. CONTEXTO DA ARQUITETURA E STACK TÉCNICA (DAILYMIND)
- **Backend:** Node.js (v22+), Express.js, `better-sqlite3` (SQLite em modo WAL), `crypto` (scrypt para senhas + tokens HMAC), `helmet`, `cors`, `validator`, `dotenv`.
- **Frontend:** SPA responsivo com HTML5 semântico, Tailwind CSS (via CDN ou classes utilitárias), JavaScript ES6+ Vanilla (Fetch API sem frameworks como React/Vue) e Chart.js para visualização gráfica.
- **Estrutura de Rotas:** Prefixo `/api`. Comunicação via JSON com respostas padronizadas `{ sucesso: boolean, dados/erro: ... }`. Autenticação por sessão opaca armazenada em Cookie HTTP-only.

---

### 2. REQUISITOS DE SEGURANÇA E ACESSO (PADRÕES GOOGLE NOVEMBRO DE 2026)
1. **Controle de Acesso Baseado em Funções (RBAC):**
   - Atualizar a tabela `usuarios` para incluir a coluna `role TEXT DEFAULT 'user'` ('user' | 'admin').
   - Middleware de autorização `requerAdmin`: Verificar se a sessão é válida E se `usuario.role === 'admin'`. Retornar `403 Forbidden` caso contrário.
2. **Segurança de Sessão e Cookies:**
   - Cookie `HttpOnly`, `Secure` (em produção), `SameSite=Strict`, com renovação de token e expiração controlada.
   - Proteção estrita contra CSRF e mitigação contra ataques de temporização/enumeração.
3. **Proteção contra Força Bruta & Input Sanitization:**
   - Rate limiting nos endpoints administrativos.
   - Sanitização rigorosa de parâmetros de consulta (filtros, limites, buscas).

---

### 3. NOVAS FUNCIONALIDADES A IMPLEMENTAR

#### A. Banco de Dados e Script de Seed (`iniciarBanco.js`)
- Alterar o esquema SQLite para incluir o campo `role` na tabela `usuarios`.
- Atualizar `iniciarBanco.js` para criar automaticamente o usuário **Super Admin Inicial** caso ele não exista:
  - **E-mail:** `admin@dailymind.com.br`
  - **Senha Padrão:** `Admin@DailyMind2026!` (com hash scrypt e salt individual).
  - **Role:** `admin`

#### B. API Backend (Endpoints Administrativos - Protegidos por Middleware Admin)
1. `GET /api/admin/dashboard/metricas`:
   - Retornar totais globais: Total de Usuários, Registros de Humor (últimos 30 dias), Médias Globais de Sono e Nível de Energia, Lembretes Concluídos vs Pendentes.
2. `GET /api/admin/usuarios`:
   - Listagem paginada e pesquisável de usuários registrados (filtros por nome, e-mail e data de cadastro).
3. `PUT /api/admin/usuarios/:id/status` ou `DELETE /api/admin/usuarios/:id`:
   - Gerenciamento de usuários (desativação/exclusão segura de dados associados em cascata).
4. `GET /api/admin/relatorios`:
   - Endpoint de geração de relatórios consolidados do sistema por período (exportação de dados agregados de uso, taxas de engajamento diário, distribuição de humores por perfil/idade).

#### C. Frontend (Interface SPA no `index.html` e `app.js`)
1. **Menu de Navegação:**
   - Exibir o link "Painel Admin" no navbar apenas para usuários com permissão de administrador.
2. **Dashboard Administrativo:**
   - **Cards de Métricas:** KPI de usuários cadastrados, acessos diários, registros mantidos.
   - **Gráficos Visuais (Chart.js):**
     - Gráfico de pizza/rosca com a distribuição de tipos de humor reportados no sistema.
     - Gráfico de barras com a evolução do cadastro de usuários por mês.
3. **Módulo de Relatórios:**
   - Filtro por intervalo de datas (Data Inicial / Data Final).
   - Tabela responsiva com estatísticas de engajamento da plataforma.
   - Botão para exportar relatórios nos formatos CSV e impressão/PDF visual.
4. **Responsividade Mobile & Desktop:**
   - Interface perfeitamente adaptável usando Tailwind CSS (Menu Mobile hambúrguer, tabelas com *scroll horizontal* no smartphone e visão em grid no desktop).

---

### 4. ENTREGÁVEIS ESPERADOS
Por favor, forneça o código refatorado e completo nos seguintes arquivos:
1. `api/iniciarBanco.js`: DDL atualizada + seed do admin.
2. `api/src/controladores/adminControlador.js`: Controladores com as consultas SQLite seguras (`better-sqlite3`).
3. `api/src/rotas/adminRotas.js` & Atualização de `app.js`: Definição das rotas e aplicação dos middlewares de segurança.
4. `frontend/index.html` & `frontend/js/app.js`: Componentes da UI administrativa, lógica de navegação SPA, gráficos Chart.js e exportação de relatórios.
```

---

## Como utilizar este prompt:
1. Baixe o arquivo `.md` acima ou copie a seção de texto entre as aspas triplas ` ```text `.
2. Abra a sua ferramenta de IA de preferência (GitHub Copilot Chat, Claude, ChatGPT).
3. Cole o prompt indicando a pasta do projeto DailyMind como contexto.