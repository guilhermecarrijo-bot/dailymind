# Escopo do Projeto — DailyMind

**Projeto:** DailyMind  
**Disciplina:** Fábrica de Soluções Inteligentes  
**Professores:** André Lôbo  
**Versão do Modelo:** UML 2.6.1 (2026)  
**Data de Elaboração:** 31/08/2026  
**Documentos Base:** Documentação Total DailyMind, Requisitos de Usuário, Requisitos de Sistema

---

## 1. Definição do Projeto

### 1.1 Identificação

| Campo | Valor |
|-------|-------|
| **Nome** | DailyMind |
| **Tipo** | Aplicação Web (SPA Full Stack) |
| **Domínio** | Saúde mental e bem-estar pessoal |
| **Público-alvo** | Pessoas neurodivergentes (TDAH, Autismo, Ansiedade) e/ou com dificuldades severas de organização |
| **Natureza** | Acadêmica — Fábrica de Soluções Inteligentes |
| **Modelo de Entrega** | Produto web auto-hospedável |

### 1.2 Visão do Produto

O DailyMind é uma plataforma web que promove o acompanhamento do autocuidado, a regulação do humor e a organização da rotina de forma adaptada, leve e sem sobrecarga. O sistema foi concebido para atender pessoas neurodivergentes que enfrentam barreiras para manter consistência em rotinas diárias e na gestão de tarefas essenciais de bem-estar.

### 1.3 Problema e Solução

**Problema identificado:**
Pessoas com divergências cognitivas enfrentam impactos diretos na rotina (esquecimento, desorganização), consequências emocionais (ansiedade, sobrecarga mental, desânimo) e funcionais (atrasos, perda de produtividade, redução da autonomia). As ferramentas disponíveis no mercado não atendem adequadamente às necessidades desses perfis.

**Solução proposta:**
- Lembretes leves e adaptados (não punitivos)
- Registro diário de bem-estar (humor, sono, energia)
- Análise visual de padrões ao longo do tempo
- Sugestões de autocuidado contextualizadas

### 1.4 Restrições e Premissas

**Restrições:**
- Aplicação web (SPA), não nativa mobile
- Banco de dados SQLite (escala acadêmica)
- Sem suporte a múltiplos idiomas na versão atual
- Sem autenticação OAuth/social (apenas credenciais locais)
- Sem suporte offline (requer conexão ativa com o servidor)

**Premissas:**
- Os usuários possuem acesso a um navegador web atualizado
- O servidor backend estará disponível durante o uso
- A persona Cuidador/Apoiador (A2) será implementada em iterações futuras

---

## 2. Arquitetura do Sistema

### 2.1 Visão Arquitetural — Modelo em Camadas (Layered Architecture)

O sistema adota uma arquitetura em camadas (3-tier) com separação clara de responsabilidades, seguindo os princípios SOLID e o padrão MVC (Model-View-Controller) no backend.

```
┌──────────────────────────────────────────────────────────────────────┐
│                         CAMADA DE APRESENTAÇÃO                       │
│                          (Presentation Layer)                         │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │   Frontend — SPA (Single Page Application)                     │  │
│  │                                                                │  │
│  │   ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐  │  │
│  │   │  index.html   │  │  estilo.css  │  │    app.js          │  │  │
│  │   │  (Estrutura)  │  │  (Estilos)   │  │  (Lógica SPA)      │  │  │
│  │   │  HTML5 semi.  │  │  Tailwind +  │  │  ES6+ / Fetch API  │  │  │
│  │   │               │  │  CSS3 custom │  │  Chart.js          │  │  │
│  │   └──────────────┘  └──────────────┘  └────────────────────┘  │  │
│  └────────────────────────────┬───────────────────────────────────┘  │
│                               │  HTTP / Fetch API                    │
├───────────────────────────────┼──────────────────────────────────────┤
│                         CAMADA DE LÓGICA                              │
│                          (Business Logic Layer)                       │
│                               │                                      │
│  ┌────────────────────────────▼───────────────────────────────────┐  │
│  │   Backend — Node.js + Express.js                                │  │
│  │                                                                │  │
│  │   ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐  │  │
│  │   │  Rotas (API) │─▶│ Controladores│─▶│   Validadores      │  │  │
│  │   │  dailyMind   │  │  (Services)  │  │   (Utilitários)    │  │  │
│  │   │  Rotas.js    │  │  6 módulos   │  │   validator lib    │  │  │
│  │   └──────────────┘  └──────┬───────┘  └────────────────────┘  │  │
│  │                            │                                   │  │
│  │   ┌──────────────────────┐ │  ┌────────────────────────────┐  │  │
│  │   │   Segurança          │ │  │   Configuração             │  │  │
│  │   │   Helmet + CORS      │ │  │   conexaoBanco.js          │  │  │
│  │   │   Crypto (hash)      │ │  │   .env (dotenv)            │  │  │
│  │   └──────────────────────┘ │  └────────────────────────────┘  │  │
│  └────────────────────────────┬───────────────────────────────────┘  │
│                               │  better-sqlite3                       │
├───────────────────────────────┼──────────────────────────────────────┤
│                         CAMADA DE DADOS                               │
│                          (Data Access Layer)                          │
│                               │                                      │
│  ┌────────────────────────────▼───────────────────────────────────┐  │
│  │   Banco de Dados — SQLite (modo WAL)                            │  │
│  │                                                                │  │
│  │   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐    │  │
│  │   │ usuarios │ │  humor   │ │   sono   │ │   energia    │    │  │
│  │   │ (PK id)  │ │ (FK usr) │ │ (FK usr) │ │  (FK usr)    │    │  │
│  │   └──────────┘ └──────────┘ └──────────┘ └──────────────┘    │  │
│  │   ┌──────────────┐ ┌──────────────┐                           │  │
│  │   │  lembretes   │ │  sugestoes   │                           │  │
│  │   │  (FK usr)    │ │  (global)    │                           │  │
│  │   └──────────────┘ └──────────────┘                           │  │
│  │   Arquivo: api/db/dailymind.db                                 │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### 2.2 Diagrama de Pacotes (Package Diagram — UML)

```
┌─────────────────────────────────────────────────────────────────┐
│                     <<package>> DailyMind                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────┐                                │
│  │     <<package>> Frontend    │                                │
│  │  ┌───────────────────────┐  │                                │
│  │  │ <<component>> View    │  │   ┌────────────────────────┐  │
│  │  │ index.html            │──┼──▶│  <<component>> API     │  │
│  │  └───────────────────────┘  │   │  Client (Fetch)        │  │
│  │  ┌───────────────────────┐  │   │  app.js                │  │
│  │  │ <<component>> Style   │  │   └───────────┬────────────┘  │
│  │  │ Tailwind + CSS3       │  │               │               │
│  │  └───────────────────────┘  │               │ HTTP          │
│  └─────────────────────────────┘               │               │
│                                                 ▼               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              <<package>> Backend                          │   │
│  │                                                          │   │
│  │  ┌───────────────┐  ┌────────────────────────────────┐   │   │
│  │  │ <<component>> │  │   <<component>> Controladores  │   │   │
│  │  │ Rotas         │──▶│                                │   │   │
│  │  │ dailyMind     │  │  UsuarioControlador             │   │   │
│  │  │ Rotas.js      │  │  HumorControlador               │   │   │
│  │  └───────────────┘  │  SonoControlador                │   │   │
│  │                     │  EnergiaControlador              │   │   │
│  │  ┌───────────────┐  │  LembreteControlador            │   │   │
│  │  │ <<component>> │  │  SugestaoControlador            │   │   │
│  │  │ Segurança     │  └───────────────┬────────────────┘   │   │
│  │  │ Helmet+CORS   │                  │                    │   │
│  │  │ Crypto        │                  │                    │   │
│  │  └───────────────┘                  │                    │   │
│  │  ┌───────────────┐                  │                    │   │
│  │  │ <<component>> │                  │                    │   │
│  │  │ Utilitários   │◀─────────────────┘                    │   │
│  │  │ validadores.js│                                       │   │
│  │  └───────────────┘                                       │   │
│  └────────────────────────────────┬───────────────────────────┘   │
│                                   │                               │
│  ┌────────────────────────────────▼───────────────────────────┐   │
│  │         <<package>> Persistência                           │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │ <<component>> Banco de Dados                         │  │   │
│  │  │ SQLite (better-sqlite3)                              │  │   │
│  │  │ conexaoBanco.js → iniciarBanco.js → dailymind.db    │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Diagrama de Componentes (Component Diagram — UML)

```
                    ┌───────────────┐
                    │  <<external>> │
                    │   Usuário     │
                    │   (A1)        │
                    └───────┬───────┘
                            │ interage via navegador
                            ▼
              ┌──────────────────────────┐
              │  <<component>>           │
              │  SPA Frontend            │
              │                          │
              │  - index.html            │
              │  - app.js                │
              │  - estilo.css            │
              │  - Tailwind CSS          │
              │  - Chart.js              │
              │                          │
              │  <<provides>>            │
              │  Interface de Usuário    │
              └────────────┬─────────────┘
                           │ <<HTTP/REST>>
                           │ Fetch API
                           ▼
              ┌──────────────────────────┐
              │  <<component>>           │
              │  API REST Backend        │
              │                          │
              │  <<provides>>            │
              │  - /api/usuarios/*       │
              │  - /api/humor/*          │
              │  - /api/sono/*           │
              │  - /api/energia/*        │
              │  - /api/lembretes/*      │
              │  - /api/sugestoes/*      │
              │  - /api/health           │
              │                          │
              │  <<requires>>            │
              │  Banco de Dados SQLite   │
              └────────────┬─────────────┘
                           │ <<SQL/IPC>>
                           │ better-sqlite3
                           ▼
              ┌──────────────────────────┐
              │  <<component>>           │
              │  SQLite Database         │
              │  dailymind.db            │
              │                          │
              │  <<provides>>            │
              │  - CRUD Operations       │
              │  - WAL Mode              │
              │  - Referential Integrity │
              └──────────────────────────┘
```

---

## 3. Modelo de Dados — Diagrama de Classes (Class Diagram — UML)

### 3.1 Diagrama de Classes do Domínio

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CLASS DIAGRAM — DailyMind                              │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐          ┌──────────────────────────────────┐
│        <<class>>             │          │         <<class>>                │
│         Usuario              │          │        RegistroHumor             │
├──────────────────────────────┤          ├──────────────────────────────────┤
│ - id: Integer {PK}           │          │ - id: Integer {PK}              │
│ - nome: String               │    1  *  │ - usuario_id: Integer {FK}      │
│ - email: String {unique}     │────┼────▶│ - emoji: HumorTipo              │
│ - senha: String (hash)       │          │ - data_registro: Date           │
│ - idade: Integer             │          ├──────────────────────────────────┤
│ - ocupacao: String           │          │ + obterPorUsuario(id): List     │
│ - data_cadastro: DateTime    │          │ + obterHoje(usuarioId): Entity  │
├──────────────────────────────┤          │ + registrar(usuarioId, emoji)   │
│ + cadastrar(dados): Entity   │          │ + atualizar(usuarioId, emoji)   │
│ + autenticar(email, senha)   │          └──────────────────────────────────┘
│ + atualizarPerfil(dados)     │
│ + obterPorEmail(email)       │          ┌──────────────────────────────────┐
└──────────────────────────────┘          │         <<class>>                │
                                          │        RegistroSono              │
┌──────────────────────────────────┐      ├──────────────────────────────────┤
│          <<enumeration>>         │      │ - id: Integer {PK}              │
│          HumorTipo               │      │ - usuario_id: Integer {FK}      │
├──────────────────────────────────┤      │ - horas_sono: Float             │
│ FELIZ                           │      │ - qualidade: QualidadeSono      │
│ TRISTE                          │      │ - data_registro: Date           │
│ ANSIOSO                         │      ├──────────────────────────────────┤
│ CANSADO                         │      │ + obterPorUsuario(id): List     │
│ IRRITADO                        │      │ + obterHoje(usuarioId): Entity  │
│ NEUTRO                          │      │ + registrar(usuarioId, dados)   │
└──────────────────────────────────┘      └──────────────────────────────────┘

┌──────────────────────────────────┐      ┌──────────────────────────────────┐
│          <<enumeration>>         │      │         <<class>>                │
│       QualidadeSono             │      │      RegistroEnergia             │
├──────────────────────────────────┤      ├──────────────────────────────────┤
│ BOM                             │      │ - id: Integer {PK}              │
│ REGULAR                         │      │ - usuario_id: Integer {FK}      │
│ RUIM                            │      │ - nivel_energia: Integer        │
└──────────────────────────────────┘      │ - data_registro: Date           │
                                          ├──────────────────────────────────┤
┌──────────────────────────────┐          │ + obterPorUsuario(id): List     │
│        <<class>>             │          │ + obterHoje(usuarioId): Entity  │
│        Lembrete              │          │ + registrar(usuarioId, nivel)   │
├──────────────────────────────┤          └──────────────────────────────────┘
│ - id: Integer {PK}           │
│ - usuario_id: Integer {FK}   │          ┌──────────────────────────────────┐
│ - titulo: String             │          │         <<class>>                │
│ - icone: String {optional}   │          │       Sugestao                  │
│ - horario: DateTime {option} │          ├──────────────────────────────────┤
│ - concluido: Boolean         │          │ - id: Integer {PK}              │
│ - data_criacao: DateTime     │          │ - humor_tipo: HumorTipo         │
├──────────────────────────────┤          │ - titulo: String                │
│ + criar(dados): Entity       │          │ - descricao: String             │
│ + toggle(id): Boolean        │          │ - icone: String                 │
│ + excluir(id): Boolean       │          ├──────────────────────────────────┤
│ + listarPorUsuario(id): List │          │ + obterPorHumor(tipo): List     │
│ + contarPendentes(id): Int   │          │ + obterTodas(): List            │
└──────────────────────────────┘          └──────────────────────────────────┘
```

### 3.2 Relacionamentos — Diagrama de Classes com Multiplicidade

```
┌────────────┐  1    *  ┌─────────────────┐
│  Usuario   │─────────▶│  RegistroHumor   │
│            │          │  (HumorTipo)     │
│            │          └─────────────────┘
│            │
│            │  1    *  ┌─────────────────┐
│            │─────────▶│  RegistroSono    │
│            │          │  (QualidadeSono) │
│            │          └─────────────────┘
│            │
│            │  1    *  ┌─────────────────┐
│            │─────────▶│ RegistroEnergia  │
│            │          │  (nivel 1-10)    │
│            │          └─────────────────┘
│            │
│            │  1    *  ┌─────────────────┐
│            │─────────▶│   Lembrete      │
│            │          │  (concluido)     │
└────────────┘          └─────────────────┘

┌─────────────────┐
│    Sugestao     │  (entidade global — sem FK para Usuario)
│  (HumorTipo)    │
└─────────────────┘

Legenda de Multiplicidade:
  1  ──── *   Um para muitos (one-to-many)
  1  ──── 1   Um para um (one-to-one)  — para registros diários (upsert)
```

### 3.3 Diagrama de Estados — Lembrete (State Machine Diagram)

```
                    ┌───────────────┐
                    │   <<start>>   │
                    └───────┬───────┘
                            │ criar()
                            ▼
                   ┌─────────────────┐
                   │    PENDENTE     │◀──────┐
                   │  concluido=false│       │
                   └────────┬────────┘       │
                            │                │
                            │ toggle()       │ toggle()
                            ▼                │
                   ┌─────────────────┐       │
                   │   CONCLUIDO     │───────┘
                   │  concluido=true │
                   └────────┬────────┘
                            │
                            │ excluir()
                            ▼
                   ┌─────────────────┐
                   │  <<final>>      │
                   │   REMOVIDO      │
                   └─────────────────┘
```

### 3.4 Diagrama de Atividades — Fluxo de Registro Diário

```
┌─────────────┐
│ <<start>>   │
└──────┬──────┘
       ▼
┌──────────────────┐
│ Usuário acessa   │
│ Dashboard        │
└──────┬───────────┘
       ▼
┌──────────────────┐    Sim    ┌──────────────────┐
│ Já registrou     │─────────▶│ Exibe registro    │
│ humor hoje?      │          │ existente         │
└──────┬───────────┘          └──────────────────┘
       │ Não
       ▼
┌──────────────────┐
│ Seleciona emoji  │
│ de humor         │
└──────┬───────────┘
       ▼
┌──────────────────┐    Falha  ┌──────────────────┐
│ Backend valida   │─────────▶│ Exibe mensagem   │
│ emoji            │          │ de erro           │
└──────┬───────────┘          └──────────────────┘
       │ OK
       ▼
┌──────────────────┐    Existe ┌──────────────────┐
│ Verifica se já   │─────────▶│ Atualiza registro│
│ existe registro  │          │ (UPSERT)         │
│ do dia           │          └──────────────────┘
└──────┬───────────┘
       │ Não existe
       ▼
┌──────────────────┐
│ Cria novo        │
│ registro         │
└──────┬───────────┘
       ▼
┌──────────────────┐
│ Retorna dados    │
│ ao frontend      │
└──────┬───────────┘
       ▼
┌──────────────────┐
│ Dashboard        │
│ atualizado       │
└──────────────────┘
```

### 3.5 Diagrama de Sequência — Fluxo de Autenticação

```
  Usuário(A1)      Frontend(SPA)       Backend(API)        BancoDados(S2)
      │                  │                   │                    │
      │ 1. Informa       │                   │                    │
      │ email + senha    │                   │                    │
      │─────────────────▶│                   │                    │
      │                  │ 2. POST           │                    │
      │                  │ /api/usuarios/    │                    │
      │                  │ login             │                    │
      │                  │──────────────────▶│                    │
      │                  │                   │ 3. SELECT usuario  │
      │                  │                   │ WHERE email=?      │
      │                  │                   │───────────────────▶│
      │                  │                   │ 4. Retorna usuario │
      │                  │                   │◀───────────────────│
      │                  │                   │                    │
      │                  │                   │ 5. Compara hash    │
      │                  │                   │ (crypto SHA-256)   │
      │                  │                   │                    │
      │                  │ 6. Retorna dados  │                    │
      │                  │ {id, nome, email} │                    │
      │                  │◀──────────────────│                    │
      │                  │                   │                    │
      │ 7. Redireciona   │                   │                    │
      │ para Dashboard   │                   │                    │
      │◀─────────────────│                   │                    │
      │                  │                   │                    │
      │ 8. Usuário       │                   │                    │
      │ acessa Dashboard │                   │                    │
      │─────────────────▶│                   │                    │
      │                  │ 9. GET registros  │                    │
      │                  │ (humor, sono,     │                    │
      │                  │  energia, etc.)   │                    │
      │                  │──────────────────▶│                    │
      │                  │                   │ 10. Consultas      │
      │                  │                   │ com usuario_id     │
      │                  │                   │───────────────────▶│
      │                  │                   │ 11. Dados          │
      │                  │                   │◀───────────────────│
      │                  │ 12. Retorna dados │                    │
      │                  │◀──────────────────│                    │
      │ 13. Dashboard    │                   │                    │
      │ renderizado      │                   │                    │
      │◀─────────────────│                   │                    │
```

---

## 4. Escopo Funcional Detalhado

### 4.1 Módulo 1: Autenticação e Gestão de Usuário

**Requisitos atendidos:** RU01, RU02, RU10, RU11 | SR01, SR02, SR03, SR04, SR13, SR16

#### 4.1.1 Funcionalidades

| ID | Funcionalidade | Descrição | Prioridade |
|----|---------------|-----------|------------|
| F01.01 | Cadastro de usuário | Criar conta com nome, email, senha, idade, ocupação | P0 |
| F01.02 | Login | Autenticar com email + senha, manter sessão | P0 |
| F01.03 | Logout | Encerrar sessão, redirecionar para login | P0 |
| F01.04 | Atualização de perfil | Editar nome, idade, ocupação (email imutável) | P2 |

#### 4.1.2 Regras de Negócio

- RN01.01: O email deve ser único — rejeição com HTTP 409 se duplicado
- RN01.02: Senhas armazenadas exclusivamente como hash SHA-256 (nunca texto plano)
- RN01.03: Mensagens de erro de login devem ser genéricas (não revelar se email ou senha está errado)
- RN01.04: Sessão mantida via estado no frontend (localStorage); logout limpa o estado
- RN01.05: Campos nome e email são obrigatórios; idade e ocupação são obrigatórios no cadastro
- RN01.06: Validação de payload limitada a tamanhos razoáveis (max 1KB por requisição)

#### 4.1.3 Endpoints

| Método | Rota | Descrição | Status Code |
|--------|------|-----------|-------------|
| POST | `/api/usuarios/cadastro` | Criar nova conta | 201, 400, 409 |
| POST | `/api/usuarios/login` | Autenticar usuário | 200, 401 |
| PUT | `/api/usuarios/perfil` | Atualizar perfil | 200, 400 |

#### 4.1.4 Telas Associadas

- Tela de cadastro (área pública)
- Tela de login (área pública)
- Tela de perfil (área autenticada)

---

### 4.2 Módulo 2: Registro de Humor

**Requisitos atendidos:** RU03 | SR05

#### 4.2.1 Funcionalidades

| ID | Funcionalidade | Descrição | Prioridade |
|----|---------------|-----------|------------|
| F02.01 | Registrar humor diário | Selecionar emoji representando o humor atual | P0 |
| F02.02 | Atualizar humor do dia | Sobrescrever registro caso o humor tenha mudado | P0 |
| F02.03 | Consultar humor atual | Exibir emoji registrado no dia corrente | P0 |
| F02.04 | Histórico de humor | Listar últimos 30 registros para gráfico | P1 |

#### 4.2.2 Regras de Negócio

- RN02.01: Apenas um registro de humor por dia por usuário (sem duplicidade)
- RN02.02: Se já existe registro no dia → realizar UPSERT (atualização)
- RN02.03: O emoji deve ser um dos valores válidos: "feliz", "triste", "ansioso", "cansado", "irritado", "neutro"
- RN02.04: Emoji inválido → rejeição com HTTP 400

#### 4.2.3 Endpoints

| Método | Rota | Descrição | Status Code |
|--------|------|-----------|-------------|
| POST | `/api/humor` | Registrar/atualizar humor do dia | 200, 400 |
| GET | `/api/humor/:usuario_id/hoje` | Consultar humor de hoje | 200 |
| GET | `/api/humor/:usuario_id` | Últimos 30 registros | 200 |

#### 4.2.4 Telas Associadas

- Seção de registro de humor no Dashboard
- Gráfico de evolução de humor

---

### 4.3 Módulo 3: Registro de Sono

**Requisitos atendidos:** RU04 | SR06

#### 4.3.1 Funcionalidades

| ID | Funcionalidade | Descrição | Prioridade |
|----|---------------|-----------|------------|
| F03.01 | Registrar sono diário | Informar horas dormidas e qualidade | P0 |
| F03.02 | Atualizar sono do dia | Sobrescrever registro se já existe | P0 |
| F03.03 | Consultar sono atual | Exibir registro do dia corrente | P0 |
| F03.04 | Histórico de sono | Listar últimos 30 registros para gráfico | P1 |

#### 4.3.2 Regras de Negócio

- RN03.01: Apenas um registro de sono por dia por usuário
- RN03.02: `horas_sono` deve ser real entre 0 e 24
- RN03.03: `qualidade` deve ser "bom", "regular" ou "ruim"
- RN03.04: Lógica UPSERT aplicada para registros duplicados no dia

#### 4.3.3 Endpoints

| Método | Rota | Descrição | Status Code |
|--------|------|-----------|-------------|
| POST | `/api/sono` | Registrar/atualizar sono do dia | 200, 400 |
| GET | `/api/sono/:usuario_id/hoje` | Consultar sono de hoje | 200 |
| GET | `/api/sono/:usuario_id` | Últimos 30 registros | 200 |

#### 4.3.4 Telas Associadas

- Seção de registro de sono no Dashboard
- Gráfico de evolução de sono

---

### 4.4 Módulo 4: Registro de Energia

**Requisitos atendidos:** RU05 | SR07

#### 4.4.1 Funcionalidades

| ID | Funcionalidade | Descrição | Prioridade |
|----|---------------|-----------|------------|
| F04.01 | Registrar energia diária | Selecionar nível de 1 a 10 | P0 |
| F04.02 | Atualizar energia do dia | Sobrescrever registro se já existe | P0 |
| F04.03 | Consultar energia atual | Exibir registro do dia corrente | P0 |
| F04.04 | Histórico de energia | Listar últimos 30 registros | P1 |

#### 4.4.2 Regras de Negócio

- RN04.01: Apenas um registro de energia por dia por usuário
- RN04.02: `nivel_energia` deve ser inteiro entre 1 e 10
- RN04.03: Lógica UPSERT aplicada

#### 4.4.3 Endpoints

| Método | Rota | Descrição | Status Code |
|--------|------|-----------|-------------|
| POST | `/api/energia` | Registrar/atualizar energia do dia | 200, 400 |
| GET | `/api/energia/:usuario_id/hoje` | Consultar energia de hoje | 200 |
| GET | `/api/energia/:usuario_id` | Últimos 30 registros | 200 |

#### 4.4.4 Telas Associadas

- Seção de registro de energia no Dashboard

---

### 4.5 Módulo 5: Gestão de Lembretes

**Requisitos atendidos:** RU06, RU07 | SR08, SR09

#### 4.5.1 Funcionalidades

| ID | Funcionalidade | Descrição | Prioridade |
|----|---------------|-----------|------------|
| F05.01 | Criar lembrete | Definir título, ícone, horário opcional | P1 |
| F05.02 | Listar lembretes | Exibir todos os lembretes do usuário | P1 |
| F05.03 | Toggle lembrete | Alternar entre pendente e concluído | P1 |
| F05.04 | Excluir lembrete | Remover permanentemente | P1 |
| F05.05 | Contar pendentes | Retornar quantidade para badge | P1 |

#### 4.5.2 Regras de Negócio

- RN05.01: Título é obrigatório (máx. 150 caracteres)
- RN05.02: Ícone e horário são opcionais
- RN05.03: Estado inicial é `concluido = false`
- RN05.04: Toggle alterna o booleano
- RN05.05: Exclusão é permanente (sem soft delete)
- RN05.06: Todos os endpoints validam `usuario_id` contra o usuário autenticado

#### 4.5.3 Endpoints

| Método | Rota | Descrição | Status Code |
|--------|------|-----------|-------------|
| POST | `/api/lembretes` | Criar novo lembrete | 201, 400 |
| GET | `/api/lembretes/:usuario_id` | Listar lembretes | 200 |
| PUT | `/api/lembretes/:id/toggle` | Alternar estado | 200 |
| DELETE | `/api/lembretes/:id` | Excluir lembrete | 204 |
| GET | `/api/lembretes/:usuario_id/pendentes` | Contar pendentes | 200 |

#### 4.5.4 Telas Associadas

- Área de lembretes no Dashboard
- Badge de pendências (cabeçalho)

---

### 4.6 Módulo 6: Sugestões de Autocuidado

**Requisitos atendidos:** RU09 | SR12, SR18

#### 4.6.1 Funcionalidades

| ID | Funcionalidade | Descrição | Prioridade |
|----|---------------|-----------|------------|
| F06.01 | Consultar sugestões do dia | Retornar sugestões baseadas no humor atual | P1 |
| F06.02 | Listar todas as sugestões | Endpoint auxiliar (uso administrativo) | P2 |

#### 4.6.2 Regras de Negócio

- RN06.01: As 12 sugestões são populadas na inicialização (2 por categoria)
- RN06.02: As sugestões são compartilhadas (não personalizadas por usuário)
- RN06.03: Se humor não registrado → array vazio (sem erro)
- RN06.04: Sugestões não devem conter teor de cobrança ou julgamento
- RN06.05: Categorias: feliz, triste, ansioso, cansado, irritado, neutro

#### 4.6.3 Endpoints

| Método | Rota | Descrição | Status Code |
|--------|------|-----------|-------------|
| GET | `/api/sugestoes/:usuario_id` | Sugestões por humor do dia | 200 |
| GET | `/api/sugestoes` | Todas as sugestões | 200 |

#### 4.6.4 Telas Associadas

- Seção de sugestões no Dashboard

---

### 4.7 Módulo 7: Dashboard e Visualização

**Requisitos atendidos:** RU07, RU08, RU11 | SR10, SR11, SR14, SR15, SR19

#### 4.7.1 Funcionalidades

| ID | Funcionalidade | Descrição | Prioridade |
|----|---------------|-----------|------------|
| F07.01 | Dashboard diário | Consolidar todos os registros do dia | P1 |
| F07.02 | Gráficos de evolução | Chart.js para humor e sono | P1 |
| F07.03 | Badge de pendências | Indicador visual discreto | P1 |
| F07.04 | Health check | Status da API | P0 |

#### 4.7.2 Regras de Negócio

- RN07.01: Dados não preenchidos exibidos como "Não registrado"
- RN07.02: Gráficos limitados a 30 registros
- RN07.03: Design anti-sobrecarga: cores suaves, sem alertas vermelhos
- RN07.04: Notificações discretas, sem linguagem punitiva
- RN07.05: Acessibilidade WCAG 2.2 AA

#### 4.7.3 Endpoints

| Método | Rota | Descrição | Status Code |
|--------|------|-----------|-------------|
| GET | `/api/health` | Status operacional | 200 |

#### 4.7.4 Telas Associadas

- Dashboard principal (área autenticada)
- Seção de gráficos

---

## 5. Estrutura de Diretórios do Projeto

```
dailymind/
├── frontend/
│   ├── index.html                          # SPA — estrutura de todas as telas
│   ├── css/
│   │   └── estilo.css                      # Estilos customizados + Tailwind
│   └── js/
│       └── app.js                          # Lógica da aplicação (SPA)
│                                           #   - Autenticação
│                                           #   - Comunicação com API
│                                           #   - Manipulação de registros
│                                           #   - Renderização de gráficos
│                                           #   - Gerenciamento de estado
│
├── api/
│   ├── src/
│   │   ├── config/
│   │   │   └── conexaoBanco.js             # Configuração da conexão SQLite
│   │   │
│   │   ├── controladores/
│   │   │   ├── usuarioControlador.js       # CRUD de usuário + autenticação
│   │   │   ├── humorControlador.js         # CRUD de registro de humor
│   │   │   ├── sonoControlador.js          # CRUD de registro de sono
│   │   │   ├── energiaControlador.js       # CRUD de registro de energia
│   │   │   ├── lembreteControlador.js      # CRUD de lembretes
│   │   │   ├── sugestaoControlador.js      # Consulta de sugestões
│   │   │   └── leadControlador.js          # [LEGADO] Não utilizado
│   │   │
│   │   ├── rotas/
│   │   │   ├── dailyMindRotas.js           # Definição de todas as rotas da API
│   │   │   └── leadRotas.js               # [LEGADO] Não utilizado
│   │   │
│   │   ├── utilitarios/
│   │   │   └── validadores.js              # Validação e sanitização de dados
│   │   │
│   │   ├── app.js                          # Configuração Express (middleware)
│   │   └── server.js                       # Inicialização do servidor
│   │
│   ├── db/
│   │   └── dailymind.db                    # Banco SQLite (gerado automaticamente)
│   │
│   ├── iniciarBanco.js                     # Script de inicialização do banco
│   └── package.json                        # Dependências do backend
│
└── doc/
    └── descricao_projeto/
        ├── Documentação_total _DailyMind.md
        ├── Requisitos_de_Usuario_DailyMind.md
        ├── Requisitos_de_Sistema_DailyMind.md
        └── Escopo_do_Projeto_DailyMind.md   # Este documento
```

---

## 6. Modelo de Dados — Dicionário de Dados

### 6.1 Tabela `usuarios`

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identificador único do usuário |
| `nome` | TEXT | NOT NULL, MAX 100 | Nome completo do usuário |
| `email` | TEXT | NOT NULL, UNIQUE | Endereço de e-mail (chave de login) |
| `senha` | TEXT | NOT NULL | Hash SHA-256 da senha (nunca texto plano) |
| `idade` | INTEGER | NOT NULL, > 0 AND <= 150 | Idade do usuário |
| `ocupacao` | TEXT | NOT NULL, MAX 100 | Ocupação profissional/acadêmica |
| `data_cadastro` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data/hora do cadastro (ISO 8601) |

### 6.2 Tabela `humor`

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identificador único do registro |
| `usuario_id` | INTEGER | NOT NULL, FOREIGN KEY → usuarios(id) ON DELETE CASCADE | Referência ao usuário |
| `emoji` | TEXT | NOT NULL, CHECK (emoji IN ('feliz','triste','ansioso','cansado','irritado','neutro')) | Tipo de humor registrado |
| `data_registro` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data do registro (ISO 8601) |

**Restrição de negócio:** Um registro por dia por usuário (implementada via UPSERT no controlador).

### 6.3 Tabela `sono`

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identificador único do registro |
| `usuario_id` | INTEGER | NOT NULL, FOREIGN KEY → usuarios(id) ON DELETE CASCADE | Referência ao usuário |
| `horas_sono` | REAL | NOT NULL, CHECK (horas_sono >= 0 AND horas_sono <= 24) | Quantidade de horas dormidas |
| `qualidade` | TEXT | NOT NULL, CHECK (qualidade IN ('bom','regular','ruim')) | Qualidade subjetiva do sono |
| `data_registro` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data do registro (ISO 8601) |

### 6.4 Tabela `energia`

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identificador único do registro |
| `usuario_id` | INTEGER | NOT NULL, FOREIGN KEY → usuarios(id) ON DELETE CASCADE | Referência ao usuário |
| `nivel_energia` | INTEGER | NOT NULL, CHECK (nivel_energia >= 1 AND nivel_energia <= 10) | Nível de energia (escala 1–10) |
| `data_registro` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data do registro (ISO 8601) |

### 6.5 Tabela `lembretes`

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identificador único do lembrete |
| `usuario_id` | INTEGER | NOT NULL, FOREIGN KEY → usuarios(id) ON DELETE CASCADE | Referência ao usuário |
| `titulo` | TEXT | NOT NULL, MAX 150 | Título do lembrete |
| `icone` | TEXT | NULLABLE | Ícone representativo (emoji/unicode) |
| `horario` | TEXT | NULLABLE | Horário programado (ISO 8601) |
| `concluido` | INTEGER | NOT NULL, DEFAULT 0 | Estado: 0=pendente, 1=concluído |
| `data_criacao` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação (ISO 8601) |

### 6.6 Tabela `sugestoes`

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identificador único da sugestão |
| `humor_tipo` | TEXT | NOT NULL, CHECK (humor_tipo IN ('feliz','triste','ansioso','cansado','irritado','neutro')) | Categoria de humor associada |
| `titulo` | TEXT | NOT NULL | Título da sugestão |
| `descricao` | TEXT | NOT NULL | Descrição detalhada da sugestão |
| `icone` | TEXT | NULLABLE | Ícone representativo |

**Nota:** Esta tabela não possui `usuario_id` — as sugestões são compartilhadas por todos os usuários e filtradas por `humor_tipo`.

### 6.7 Índices

| Tabela | Índice | Coluna(s) | Propósito |
|--------|--------|-----------|-----------|
| `usuarios` | `idx_usuarios_email` | `email` | Busca rápida por email (login/cadastro) |
| `humor` | `idx_humor_usuario_data` | `usuario_id, data_registro` | UPSERT e consulta diária |
| `sono` | `idx_sono_usuario_data` | `usuario_id, data_registro` | UPSERT e consulta diária |
| `energia` | `idx_energia_usuario_data` | `usuario_id, data_registro` | UPSERT e consulta diária |
| `lembretes` | `idx_lembretes_usuario` | `usuario_id` | Listagem por usuário |
| `lembretes` | `idx_lembretes_pendentes` | `usuario_id, concluido` | Contagem de pendentes |
| `sugestoes` | `idx_sugestoes_humor` | `humor_tipo` | Busca por categoria de humor |

---

## 7. Stack Tecnológica Completa

### 7.1 Frontend

| Tecnologia | Versão | Finalidade |
|-----------|--------|------------|
| HTML5 Semântico | — | Estrutura da SPA |
| CSS3 | — | Estilos base |
| Tailwind CSS | 3.x+ | Framework CSS utilitário |
| JavaScript ES6+ | — | Lógica da aplicação |
| Fetch API | — | Comunicação HTTP com a API |
| Chart.js | 4.x+ | Renderização de gráficos |
| Google Fonts | — | Tipografia (inter/lexend) |

### 7.2 Backend

| Tecnologia | Versão | Finalidade |
|-----------|--------|------------|
| Node.js | 18+ LTS | Ambiente de execução |
| Express.js | 4.x | Framework HTTP/routing |
| better-sqlite3 | 9.x+ | Driver SQLite síncrono |
| Helmet | 7.x+ | Cabeçalhos de segurança HTTP |
| CORS | 2.x | Controle de origens |
| validator | 13.x+ | Validação/sanitização de dados |
| dotenv | 16.x | Variáveis de ambiente |
| Crypto (内置) | — | Hash SHA-256 de senhas |

### 7.3 Banco de Dados

| Componente | Especificação |
|-----------|---------------|
| Motor | SQLite 3.x |
| Modo | WAL (Write-Ahead Logging) |
| Arquivo | `api/db/dailymind.db` |
| Driver | better-sqlite3 (síncrono) |
| Integridade | Chaves estrangeiras + ON DELETE CASCADE |

### 7.4 Ferramentas de Desenvolvimento

| Ferramenta | Finalidade |
|-----------|------------|
| Git | Controle de versão |
| VS Code | IDE de desenvolvimento |
| Insomnia/Postman | Teste de endpoints |
| Chrome DevTools | Debug do frontend |

---

## 8. Diagrama de Implantação (Deployment Diagram — UML)

```
┌─────────────────────────────────────────────────────────────────┐
│                    <<deployment diagram>>                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐                                        │
│  │  <<device>>         │                                        │
│  │  Máquina do Usuário │                                        │
│  │                     │                                        │
│  │  ┌───────────────┐  │      ┌──────────────────────────┐     │
│  │  │ <<execution   │  │ HTTP │     <<device>>           │     │
│  │  │  environment>>│  │◀────▶│     Servidor             │     │
│  │  │               │  │      │                          │     │
│  │  │  Navegador    │  │      │  ┌────────────────────┐  │     │
│  │  │  Web          │  │      │  │ <<execution env>>  │  │     │
│  │  │               │  │      │  │ Node.js + Express  │  │     │
│  │  │  - SPA        │  │      │  │                    │  │     │
│  │  │  - HTML/CSS   │  │      │  │ <<artifact>>       │  │     │
│  │  │  - JS (ES6+)  │  │      │  │ server.js          │  │     │
│  │  │  - Chart.js   │  │      │  │ app.js             │  │     │
│  │  └───────────────┘  │      │  │ Controladores (6)  │  │     │
│  │                     │      │  │ Rotas              │  │     │
│  │  ┌───────────────┐  │      │  │ Validadores        │  │     │
│  │  │ <<artifact>>  │  │      │  └────────────────────┘  │     │
│  │  │ index.html    │  │      │            │              │     │
│  │  │ estilo.css    │  │      │            │ better-      │     │
│  │  │ app.js        │  │      │            │ sqlite3      │     │
│  │  └───────────────┘  │      │            │              │     │
│  └─────────────────────┘      │  ┌─────────▼───────────┐  │     │
│                               │  │ <<execution env>>   │  │     │
│                               │  │ SQLite              │  │     │
│                               │  │                     │  │     │
│                               │  │ <<artifact>>        │  │     │
│                               │  │ dailymind.db        │  │     │
│                               │  │ (modo WAL)          │  │     │
│                               │  └─────────────────────┘  │     │
│                               └──────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Ciclo de Vida do Projeto — Fases e Entregas

### 9.1 Fases do Projeto

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  FASE 1     │    │  FASE 2     │    │  FASE 3     │    │  FASE 4     │
│  Concepção  │───▶│  Construção │───▶│  Validação  │───▶│  Entrega    │
│  e Planeja- │    │  e Desen-   │    │  e Testes   │    │  e Manuten- │
│  mento      │    │  volvimento │    │             │    │  ção        │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
  Semanas 1-2        Semanas 3-7        Semana 8          Semana 9+
```

### 9.2 Detalhamento por Fase

#### FASE 1 — Concepção e Planejamento (Semanas 1–2)

| Entregável | Descrição | Responsável |
|-----------|-----------|-------------|
| Documentação Total | Brainstorming e mapeamento completo | Equipe |
| Requisitos de Usuário | RU01–RU11 refinados (UML 2.0+) | Equipe |
| Requisitos de Sistema | SR01–SR19 derivados dos RU | Equipe |
| Escopo do Projeto | Este documento | Equipe |

**Critérios de conclusão da fase:**
- Todos os documentos de requisitos aprovados
- Escopo definido e validado pela equipe
- Stack tecnológica definida

#### FASE 2 — Construção e Desenvolvimento (Semanas 3–7)

| Entregável | Semana | Dependências |
|-----------|--------|-------------|
| Configuração do ambiente (Node.js, SQLite) | 3 | Fase 1 |
| Estrutura de pastas e dependências | 3 | — |
| Banco de dados (tabelas, índices, seed) | 3 | — |
| Backend: Módulo Autenticação (SR01–SR04) | 4 | Banco |
| Backend: Módulo Registros Diários (SR05–SR07) | 4–5 | Autenticação |
| Backend: Módulo Lembretes (SR08–SR09) | 5 | Autenticação |
| Backend: Módulo Sugestões (SR12) | 5 | Registros |
| Backend: Segurança e Health Check (SR15–SR16) | 6 | Todos os módulos |
| Frontend: Tela de Cadastro/Login | 4 | API Cadastro/Login |
| Frontend: Dashboard Principal | 5–6 | API Registros |
| Frontend: Área de Lembretes | 6 | API Lembretes |
| Frontend: Gráficos de Evolução (Chart.js) | 6–7 | API Histórico |
| Frontend: Perfil e Atualização (SR13) | 7 | API Perfil |
| Frontend: Design Anti-Sobrecarga (SR14) | 7 | — |

**Critérios de conclusão da fase:**
- Todos os endpoints implementados e funcionais
- Frontend consumindo API com dados reais
- Banco populado com dados de teste
- Nenhum erro crítico identificado

#### FASE 3 — Validação e Testes (Semana 8)

| Atividade | Descrição |
|-----------|-----------|
| Testes unitários | Validar cada controlador individualmente |
| Testes de integração | Validar fluxos completos (cadastro → login → registros) |
| Testes de validação | Dados inválidos, SQL injection, XSS |
| Testes de UX | Acessibilidade, responsividade, usabilidade |
| Revisão de código | Conformidade com convenções e boas práticas |

**Critérios de conclusão da fase:**
- Todos os cenários de aceitação dos SRs atendidos
- Nenhum bug P0/P1 identificado
- Performance adequada (respostas < 500ms)

#### FASE 4 — Entrega e Manutenção (Semana 9+)

| Atividade | Descrição |
|-----------|-----------|
| Deploy em produção | Disponibilização do sistema |
| Documentação final | Atualização de todos os documentos |
| Planejamento iteração futura | Persona Cuidador/Apoiador (A2) |
| Manutenção | Correção de bugs e ajustes |

---

## 10. Matriz de Rastreabilidade Completa

### 10.1 Usuário → Sistema → Módulo → Funcionalidade

| RU | SR(s) | Módulo | Funcionalidade(s) |
|----|--------|--------|-------------------|
| RU01 | SR01, SR02, SR16 | Mód. 1: Autenticação | F01.01 |
| RU02 | SR03, SR04, SR16 | Mód. 1: Autenticação | F01.02, F01.03 |
| RU03 | SR05 | Mód. 2: Humor | F02.01, F02.02, F02.03, F02.04 |
| RU04 | SR06 | Mód. 3: Sono | F03.01, F03.02, F03.03, F03.04 |
| RU05 | SR07 | Mód. 4: Energia | F04.01, F04.02, F04.03, F04.04 |
| RU06 | SR08 | Mód. 5: Lembretes | F05.01, F05.02 |
| RU07 | SR09 | Mód. 5: Lembretes | F05.05 |
| RU08 | SR10, SR11 | Mód. 7: Dashboard | F07.02 |
| RU09 | SR12, SR18 | Mód. 6: Sugestões | F06.01, F06.02 |
| RU10 | SR13 | Mód. 1: Autenticação | F01.04 |
| RU11 | SR14 | Mód. 7: Dashboard | F07.01, F07.03, F07.04 |

### 10.2 Requisitos de Sistema → Endpoints

| SR | Endpoint(s) |
|----|-------------|
| SR01 | POST /api/usuarios/cadastro |
| SR02 | Todos (middleware de validação) |
| SR03 | POST /api/usuarios/login |
| SR04 | Todas as rotas autenticadas |
| SR05 | POST /api/humor, GET /api/humor/:id/hoje, GET /api/humor/:id |
| SR06 | POST /api/sono, GET /api/sono/:id/hoje, GET /api/sono/:id |
| SR07 | POST /api/energia, GET /api/energia/:id/hoje, GET /api/energia/:id |
| SR08 | POST /api/lembretes, GET /api/lembretes/:id, PUT /api/lembretes/:id/toggle, DELETE /api/lembretes/:id |
| SR09 | GET /api/lembretes/:id/pendentes |
| SR10 | GET /api/humor/:id, GET /api/sono/:id |
| SR11 | GET /api/humor/:id, GET /api/sono/:id, GET /api/energia/:id |
| SR12 | GET /api/sugestoes/:id, GET /api/sugestoes |
| SR13 | PUT /api/usuarios/perfil |
| SR14 | Frontend (design) |
| SR15 | GET /api/health |
| SR16 | Middleware global (Helmet, CORS, validação) |
| SR17 | Configuração SQLite (conexaoBanco.js) |
| SR18 | iniciarBanco.js |
| SR19 | Frontend (Dashboard) |

---

## 11. Critérios de Qualidade e Aceitação Global

### 11.1 Critérios Funcionais

| Critério | Métrica | Nível Aceitável |
|----------|---------|-----------------|
| Cobertura de requisitos | % de SRs implementados | 100% (P0), 100% (P1) |
| Taxa de cadastro bem-sucedido | Testes de cadastro | 100% |
| Taxa de autenticação | Testes de login | 100% |
| UPSERT diário | Testes de registro | 100% |
| Integridade de dados | Testes de isolamento | 100% |

### 11.2 Critérios Não-Funcionais

| Critério | Métrica | Nível Aceitável |
|----------|---------|-----------------|
| Tempo de resposta | Latência da API | < 500ms |
| Segurança de senhas | Armazenamento | Hash SHA-256 |
| Validação de entrada | SQL Injection/XSS | 0 vulnerabilidades |
| Acessibilidade | WCAG 2.2 | Nível AA |
| Design anti-sobrecarga | Avaliação visual | Sem alertas punitivos |
| Compatibilidade | Navegadores | Chrome, Firefox, Safari, Edge (2 últimos estáveis) |
| Responsividade | Layout | Desktop (mín. 1024px) |

---

## 12. Riscos e Mitigação

| ID | Risco | Impacto | Probabilidade | Mitigação |
|----|-------|---------|---------------|-----------|
| R01 | Dados do SQLite corrompidos | Alto | Baixa | Backup periódico do arquivo .db; modo WAL ativo |
| R01 | Vulnerabilidades de segurança | Alto | Média | Helmet, validação rigorosa, consultas preparadas |
| R03 | Sobrecarga visual para o público-alvo | Alto | Média | Design iterativo com foco em anti-sobrecarga; testes com usuários |
| R04 | Escalabilidade limitada (SQLite) | Médio | Alta | Aceitável para escala acadêmica; migração possível se necessário |
| R05 | Perda de dados de sessão no frontend | Médio | Baixa | Persistência em localStorage; tratamento de erros |

---

## 13. Plano de Manutenção e Evolução

### 13.1 Manutenção Corretiva

- Correção de bugs identificados em produção
- Prazo máximo: 48h para bugs P0, 1 semana para P1

### 13.2 Manutenção Adaptativa

- Atualização de dependências (npm audit)
- Compatibilidade com novas versões de navegadores

### 13.3 Manutenção Evolutiva (Roadmap Futuro)

| Iteração | Funcionalidade | Requisito | Prioridade |
|----------|---------------|-----------|------------|
| v2.0 | Persona Cuidador/Apoiador | A2 | P2 |
| v2.1 | Autenticação OAuth (Google) | — | P2 |
| v2.2 | Modo offline (Service Worker) | — | P2 |
| v2.3 | Suporte a múltiplos idiomas | — | P3 |
| v2.4 | Dashboard do Cuidador | — | P2 |
| v2.5 | Notificações push (PWA) | — | P2 |
| v3.0 | Migração para PostgreSQL | — | P3 |
| v3.1 | App mobile nativo (React Native) | — | P3 |

### 13.4 Indicadores de Saúde do Projeto

| Indicator | Meta |
|-----------|------|
| Cobertura de testes | ≥ 80% |
| Vulnerabilidades conhecidas (npm audit) | 0 críticas |
| Tempo médio de resposta da API | < 300ms |
| Bugs abertos P0 | 0 |
| Bugs abertos P1 | ≤ 2 |

---

## 14. Referências

- Documentação Total DailyMind (brainstorming do projeto)
- Requisitos de Usuário — DailyMind (RU01–RU11)
- Requisitos de Sistema — DailyMind (SR01–SR19)
- UML 2.6.1 Specification — Object Management Group (OMG), 2024
- Booch, G., Rumbaugh, J., & Jacobson, I. *The Unified Modeling Language User Guide*, 3rd Edition, 2025
- Fowler, M. *UML Distilled: A Brief Guide to the Standard Object Modeling Language*, 4th Edition, 2024
- Sommerville, I. *Software Engineering*, 11th Edition, 2025
- Pressman, R. *Software Engineering: A Practitioner's Approach*, 9th Edition, 2025
- Express.js Documentation — https://expressjs.com
- SQLite Documentation — https://www.sqlite.org/docs.html
- Chart.js Documentation — https://www.chartjs.org
- WCAG 2.2 — https://www.w3.org/TR/WCAG22/
