# Requisitos de Sistema — DailyMind

**Projeto:** DailyMind  
**Disciplina:** Fábrica de Soluções Inteligentes  
**Professores:** André Lôbo e Carlos Eduardo.  
**Integrantes:** Ana Eduarda Sousa Silva Soares, Byank Chrystinny Santana Lima, Emanuele Oliveira Andrade, Guilherme dos Santos Carrijo e Maria Eduarda Pereira Sastre. 
**Versão do Modelo:** UML 2.6.1 (2026)  
**Data de Elaboração:** 31/08/2026  
**Documento Base:** Requisitos de Usuário — DailyMind

---

## 1. Escopo e Visão Geral

O presente documento formaliza os **Requisitos de Sistema (SR)** do DailyMind, derivados dos Requisitos de Usuário (RU) documentados separadamente. Cada requisito de sistema é descrito seguindo a convenção UML 2.0+ (2026), incluindo identificador único, descrição funcional, entradas, saídas, regras de processamento, critérios de aceitação, dependências e classificação de prioridade.

### 1.1 Classificação de Prioridades

| Nível | Descrição |
|-------|-----------|
| **P0** | Essencial — o sistema não pode operar sem este componente |
| **P1** | Importante — necessário para a experiência completa |
| **P2** | Desejável — pode ser implementado em iterações futuras |

### 1.2 Atores do Sistema

| ID | Ator | Descrição |
|----|------|-----------|
| **A1** | Usuário Final | Pessoa que interage com a interface web do DailyMind. |
| **S1** | Sistema (Backend) | Servidor Node.js + Express que processa requisições e aplica regras de negócio. |
| **S2** | Banco de Dados | SQLite — persistência de dados. |

---

## 2. Requisitos de Sistema

---

### SR01 — Serviço de Cadastro de Usuário

- **ID:** SR01
- **RU Origem:** RU01
- **Ator(es):** A1 → S1 → S2
- **Prioridade:** P0
- **Descrição:** O sistema deve disponibilizar um endpoint `POST /api/usuarios/cadastro` que receba os dados do novo usuário (nome, e-mail, senha, idade, ocupação), valide-os, verifique a unicidade do e-mail, armazene a senha com scrypt e salt individual e persista os dados na tabela `usuarios`.
- **Entradas:**
  - `nome` (string, obrigatório, máx. 100 caracteres)
  - `email` (string, obrigatório, formato válido, único)
  - `senha` (string, obrigatório, entre 8 e 128 caracteres)
  - `idade` (inteiro, obrigatório, > 0 e ≤ 150)
  - `ocupacao` (string, obrigatório, máx. 100 caracteres)
- **Saídas:**
  - Sucesso (HTTP 201): `{ id, nome, email, idade, ocupacao, data_cadastro }`
  - Erro (HTTP 400/409): `{ erro: "<mensagem>" }`
- **Regras de Processamento:**
  1. Validar todos os campos de entrada.
  2. Consultar a tabela `usuarios` para verificar se o `email` já existe.
  3. Gerar hash da senha utilizando `crypto.createHash('sha256')`.
  4. Inserir registro na tabela `usuarios`.
  5. Retornar os dados do usuário (sem a senha).
- **Critérios de Aceitação:**
  - Dados válidos e e-mail disponível → Conta criada com sucesso (201).
  - E-mail já cadastrado → Rejeição com erro 409.
  - Dados inválidos → Rejeição com erro 400 e indicação dos campos com problema.

---

### SR02 — Serviço de Validação e Sanitização de Dados

- **ID:** SR02
- **RU Origem:** RU01, RU03, RU04, RU05, RU06, RU10
- **Ator(es):** S1
- **Prioridade:** P0
- **Descrição:** O sistema deve validar e sanitizar todos os dados recebidos do frontend antes de processá-los, utilizando a biblioteca `validator` para garantir integridade e segurança.
- **Regras de Processamento:**
  1. Aplicar sanitização em todos os campos de tipo string (`trim`, `escape`).
  2. Validar formatos de e-mail e campos numéricos.
  3. Limitar o tamanho dos payloads para prevenir abusos.
  4. Utilizar consultas preparadas (prepared statements) em todas as operações SQL.
- **Critérios de Aceitação:**
  - Dados maliciosos (SQL Injection, XSS) → Sistema rejeita e não processa.
  - Payload excedendo limite → Sistema rejeita com erro 413.

---

### SR03 — Serviço de Autenticação de Sessão

- **ID:** SR03
- **RU Origem:** RU02
- **Ator(es):** A1 → S1
- **Prioridade:** P0
- **Descrição:** O sistema deve disponibilizar um endpoint `POST /api/usuarios/login` que autentique o usuário com base em e-mail e senha, retornando os dados básicos do perfil e mantendo a sessão durante o acesso à aplicação.
- **Entradas:**
  - `email` (string, obrigatório)
  - `senha` (string, obrigatório)
- **Saídas:**
  - Sucesso (HTTP 200): `{ id, nome, email, idade, ocupacao }`
  - Erro (HTTP 401): `{ erro: "Credenciais inválidas" }`
- **Regras de Processamento:**
  1. Consultar tabela `usuarios` pelo `email`.
  2. Comparar hash da senha informada com a armazenada.
  3. Em caso de sucesso, retornar dados do usuário.
  4. Em caso de falha, retornar erro genérico (não expor se o e-mail ou a senha está incorreto).
- **Critérios de Aceitação:**
  - Credenciais corretas → Dados do usuário retornados.
  - Credenciais incorretas → Erro 401 sem detalhes.
  - E-mail inexistente → Mesmo erro 401 (não revelar inexistência).

---

### SR04 — Controle de Acesso e Isolamento de Dados

- **ID:** SR04
- **RU Origem:** RU02
- **Ator(es):** S1
- **Prioridade:** P0
- **Descrição:** O sistema deve associar todos os registros ao usuário autenticado, garantindo que cada usuário visualize e manipule exclusivamente seus próprios dados.
- **Regras de Processamento:**
  1. Todas as rotas autenticadas devem extrair o `usuario_id` da sessão/requisição.
  2. Consultas ao banco devem filtrar obrigatoriamente por `usuario_id`.
  3. O sistema deve rejeitar tentativas de acesso a dados de outros usuários (HTTP 403).
- **Critérios de Aceitação:**
  - Acesso aos próprios dados → Permitido.
  - Tentativa de acesso a dados de outro usuário → Bloqueado (403).

---

### SR05 — Serviço de Registro de Humor

- **ID:** SR05
- **RU Origem:** RU03
- **Ator(es):** A1 → S1 → S2
- **Prioridade:** P0
- **Descrição:** O sistema deve disponibilizar os endpoints `POST /api/humor` e `GET /api/humor/:usuario_id/hoje` para registro e consulta do humor diário, utilizando a tabela `humor`.
- **Entradas:**
  - `usuario_id` (inteiro, obrigatório — derivado da sessão)
  - `emoji` (string, obrigatório, válido: "feliz", "triste", "ansioso", "cansado", "irritado", "neutro")
- **Saídas:**
  - Registro criado/atualizado (HTTP 200): `{ id, usuario_id, emoji, data_registro }`
  - Consulta (HTTP 200): Registro do dia ou `{ mensagem: "Nenhum registro encontrado" }`
- **Regras de Processamento:**
  1. Verificar se já existe registro para o dia atual do usuário.
  2. Se existir → atualizar o registro (UPSERT).
  3. Se não existir → criar novo registro com a data atual.
  4. Validar que o `emoji` pertence à lista permitida.
- **Endpoint adicional:** `GET /api/humor/:usuario_id` → Retorna os últimos 30 registros históricos.
- **Critérios de Aceitação:**
  - Primeiro registro do dia → Criado com sucesso.
  - Registro duplicado no dia → Atualizado sem criar duplicidade.
  - Emoji inválido → Rejeição com erro 400.

---

### SR06 — Serviço de Registro de Sono

- **ID:** SR06
- **RU Origem:** RU04
- **Ator(es):** A1 → S1 → S2
- **Prioridade:** P0
- **Descrição:** O sistema deve disponibilizar os endpoints `POST /api/sono` e `GET /api/sono/:usuario_id/hoje` para registro e consulta de sono diário, utilizando a tabela `sono`.
- **Entradas:**
  - `usuario_id` (inteiro, obrigatório)
  - `horas_sono` (real, obrigatório, 0 ≤ valor ≤ 24)
  - `qualidade` (string, obrigatório, válido: "bom", "regular", "ruim")
- **Saídas:**
  - Sucesso (HTTP 200): `{ id, usuario_id, horas_sono, qualidade, data_registro }`
- **Regras de Processamento:**
  1. Verificar se já existe registro de sono para o dia atual.
  2. Aplicar lógica UPSERT (atualizar se existir, criar se não).
  3. Validar intervalo de `horas_sono` e valor de `qualidade`.
- **Endpoint adicional:** `GET /api/sono/:usuario_id` → Retorna os últimos 30 registros históricos.
- **Critérios de Aceitação:**
  - Valores dentro do intervalo → Registro armazenado.
  - `horas_sono` fora de 0–24 → Rejeição com erro 400.
  - Qualidade inválida → Rejeição com erro 400.

---

### SR07 — Serviço de Registro de Energia

- **ID:** SR07
- **RU Origem:** RU05
- **Ator(es):** A1 → S1 → S2
- **Prioridade:** P0
- **Descrição:** O sistema deve disponibilizar os endpoints `POST /api/energia` e `GET /api/energia/:usuario_id/hoje` para registro e consulta do nível de energia diário, utilizando a tabela `energia`.
- **Entradas:**
  - `usuario_id` (inteiro, obrigatório)
  - `nivel_energia` (inteiro, obrigatório, 1 ≤ valor ≤ 10)
- **Saídas:**
  - Sucesso (HTTP 200): `{ id, usuario_id, nivel_energia, data_registro }`
- **Regras de Processamento:**
  1. Verificar se já existe registro de energia para o dia atual.
  2. Aplicar lógica UPSERT.
  3. Validar que `nivel_energia` está na escala de 1 a 10.
- **Endpoint adicional:** `GET /api/energia/:usuario_id` → Retorna os últimos 30 registros históricos.
- **Critérios de Aceitação:**
  - Valor entre 1 e 10 → Registro armazenado.
  - Valor fora da escala → Rejeição com erro 400.

---

### SR08 — Serviço de Gestão de Lembretes

- **ID:** SR08
- **RU Origem:** RU06
- **Ator(es):** A1 → S1 → S2
- **Prioridade:** P1
- **Descrição:** O sistema deve disponibilizar endpoints para criação, listagem, atualização e exclusão de lembretes, utilizando a tabela `lembretes`.
- **Endpoints:**
  - `POST /api/lembretes` — Criar lembrete
  - `GET /api/lembretes/:usuario_id` — Listar lembretes do usuário
  - `PUT /api/lembretes/:id/toggle` — Alternar estado (pendente ↔ concluído)
  - `DELETE /api/lembretes/:id` — Excluir lembrete
- **Entradas (POST):**
  - `usuario_id` (inteiro, obrigatório)
  - `titulo` (string, obrigatório, máx. 150 caracteres)
  - `icone` (string, opcional)
  - `horario` (string/ISO 8601, opcional)
- **Saídas:**
  - Criação (HTTP 201): `{ id, usuario_id, titulo, icone, horario, concluido: false, data_criacao }`
  - Toggle (HTTP 200): `{ id, concluido: <novo_estado> }`
  - Exclusão (HTTP 204): Sem corpo.
- **Regras de Processamento:**
  1. Criar lembrete com `concluido` definido como `false`.
  2. Toggle alterna o booleano `concluido`.
  3. Exclusão remove permanentemente o registro.
  4. Todos os endpoints validam `usuario_id` contra o usuário autenticado.
- **Critérios de Aceitação:**
  - Criação com título válido → Lembrete criado.
  - Título vazio → Rejeição com erro 400.
  - Toggle → Estado alterado com sucesso.
  - Exclusão → Registro removido permanentemente.

---

### SR09 — Serviço de Indicador de Pendências

- **ID:** SR09
- **RU Origem:** RU07
- **Ator(es):** A1 → S1 → S2
- **Prioridade:** P1
- **Descrição:** O sistema deve disponibilizar o endpoint `GET /api/lembretes/:usuario_id/pendentes` que retorne a quantidade de lembretes com `concluido = false` para exibição no badge de pendências do frontend.
- **Saídas:**
  - Sucesso (HTTP 200): `{ pendentes: <quantidade> }`
- **Regras de Processamento:**
  1. Consultar tabela `lembretes` filtrando por `usuario_id` e `concluido = false`.
  2. Contar registros e retornar a quantidade.
- **Critérios de Aceitação:**
  - Lembretes pendentes existem → Quantidade correta retornada.
  - Nenhum pendente → `{ pendentes: 0 }`.

---

### SR10 — Serviço de Geração de Gráficos de Evolução

- **ID:** SR10
- **RU Origem:** RU08
- **Ator(es):** A1 → S1 → Frontend (Chart.js)
- **Prioridade:** P1
- **Descrição:** O sistema deve disponibilizar os endpoints de consulta histórica (`GET /api/humor/:usuario_id`, `GET /api/sono/:usuario_id`) que retornem os últimos 30 registros, habilitando o frontend a renderizar gráficos de evolução utilizando a biblioteca Chart.js.
- **Entradas:**
  - `usuario_id` (inteiro, via path parameter)
- **Saídas:**
  - Sucesso (HTTP 200): Array de registros ordenados por `data_registro` ASC.
  - Sem dados (HTTP 200): Array vazio `[]`.
- **Regras de Processamento:**
  1. Consultar registros associados ao `usuario_id`.
  2. Limitar retorno a 30 registros mais recentes.
  3. Ordenar por data de registro crescente.
- **Critérios de Aceitação:**
  - Registros disponíveis → Array com até 30 entradas retornado.
  - Sem registros → Array vazio.

---

### SR11 — Serviço de Consulta de Histórico

- **ID:** SR11
- **RU Origem:** RU08
- **Ator(es):** A1 → S1 → S2
- **Prioridade:** P1
- **Descrição:** O sistema deve permitir a consulta do histórico consolidado de humor, sono e energia, possibilitando ao usuário acompanhar mudanças ao longo do tempo.
- **Endpoints:**
  - `GET /api/humor/:usuario_id` → Últimos 30 registros de humor
  - `GET /api/sono/:usuario_id` → Últimos 30 registros de sono
  - `GET /api/energia/:usuario_id` → Últimos 30 registros de energia
- **Regras de Processamento:**
  1. Filtrar registros exclusivamente pelo `usuario_id` autenticado.
  2. Retornar dados completos incluindo `data_registro`.
- **Critérios de Aceitação:**
  - Dados existentes → Array com registros retornados.
  - Acesso cross-user → Bloqueado (403).

---

### SR12 — Serviço de Sugestões de Autocuidado

- **ID:** SR12
- **RU Origem:** RU09
- **Ator(es):** A1 → S1 → S2
- **Prioridade:** P1
- **Descrição:** O sistema deve disponibilizar o endpoint `GET /api/sugestoes/:usuario_id` que retorne sugestões de autocuidado relacionadas ao humor registrado pelo usuário no dia atual, consultando a tabela `sugestoes`.
- **Entradas:**
  - `usuario_id` (inteiro, via path parameter)
- **Saídas:**
  - Sucesso (HTTP 200): Array de sugestões `{ id, humor_tipo, titulo, descricao, icone }`
  - Sem humor registrado (HTTP 200): Array vazio `[]`
- **Regras de Processamento:**
  1. Consultar o registro de humor do dia atual do usuário.
  2. Se existir humor → buscar na tabela `sugestoes` as entradas com `humor_tipo` correspondente.
  3. Se não existir humor → retornar array vazio.
  4. As sugestões são compartilhadas (não personalizadas por usuário).
- **Endpoint auxiliar:** `GET /api/sugestoes` → Retorna todas as sugestões cadastradas (uso administrativo).
- **Critérios de Aceitação:**
  - Humor registrado → Sugestões da categoria retornadas.
  - Humor não registrado → Array vazio.
  - Categoria inexistente → Array vazio (sem erro).

---

### SR13 — Serviço de Atualização de Perfil

- **ID:** SR13
- **RU Origem:** RU10
- **Ator(es):** A1 → S1 → S2
- **Prioridade:** P2
- **Descrição:** O sistema deve disponibilizar o endpoint `PUT /api/usuarios/perfil` que permita ao usuário autenticado atualizar nome, idade e ocupação.
- **Entradas:**
  - `usuario_id` (inteiro, derivado da sessão)
  - `nome` (string, opcional, máx. 100 caracteres)
  - `idade` (inteiro, opcional, > 0 e ≤ 150)
  - `ocupacao` (string, opcional, máx. 100 caracteres)
- **Saídas:**
  - Sucesso (HTTP 200): Dados atualizados do usuário.
  - Erro (HTTP 400): `{ erro: "<mensagem>" }`
- **Regras de Processamento:**
  1. Apenas os campos fornecidos devem ser atualizados (atualização parcial).
  2. O campo `email` não pode ser modificado.
  3. Campos obrigatórios (nome) não podem ser definidos como vazio.
- **Critérios de Aceitação:**
  - Atualização parcial → Somente campos informados são alterados.
  - Tenta alterar e-mail → Ignorado ou rejeitado.
  - Nome vazio → Rejeição com erro 400.

---

### SR14 — Serviço de Notificações e Design Anti-Sobrecarga

- **ID:** SR14
- **RU Origem:** RU11
- **Ator(es):** S1, Frontend
- **Prioridade:** P0
- **Descrição:** O sistema deve apresentar notificações e indicadores visuais discretos, auxiliando na organização da rotina sem utilizar mensagens de cobrança, punição ou penalização. O design deve seguir princípios de acessibilidade e anti-sobrecarga.
- **Regras de Implementação:**
  1. Notificações devem utilizar cores suaves e linguagem neutra.
  2. Não devem ser exibidos alertas vermelhos agressivos ou ícones de penalização.
  3. O badge de pendências deve ser informativo, não punitivo.
  4. Dias sem registro não devem gerar alertas ou cobranças.
  5. O usuário deve poder ignorar lembretes sem consequências visuais negativas.
- **Critérios de Aceitação:**
  - Lembrete pendente → Indicador visual discreto, sem penalização.
  - Dia sem registro → Sem notificações de cobrança.
  - Acessibilidade → Cores e tipografia seguem WCAG 2.2 AA.

---

### SR15 — Serviço de Health Check

- **ID:** SR15
- **RU Origem:** N/A (Requisito Infraestrutural)
- **Ator(es):** S1
- **Prioridade:** P0
- **Descrição:** O sistema deve disponibilizar o endpoint `GET /api/health` que retorne o status operacional da API.
- **Saídas:**
  - Sucesso (HTTP 200): `{ status: "ok", timestamp: "<ISO 8601>" }`
- **Critérios de Aceitação:**
  - API operacional → Status 200 com timestamp.

---

### SR16 — Serviço de Segurança e Proteção de Dados

- **ID:** SR16
- **RU Origem:** RU01, RU02, RU11
- **Ator(es):** S1
- **Prioridade:** P0
- **Descrição:** O sistema deve aplicar mecanismos de segurança em todas as camadas, incluindo cabeçalhos HTTP (Helmet), controle de origens (CORS), hash adaptativo de senhas (scrypt), sessões opacas revogáveis e limitação de payload.
- **Regras de Implementação:**
  1. Aplicar middleware Helmet em todas as rotas.
  2. Configurar CORS para aceitar apenas origens autorizadas.
  3. Nunca armazenar senhas em texto plano; migrar hashes legados após autenticação bem-sucedida.
  4. Armazenar `CHAVE_SESSAO` somente no ambiente/gerenciador de segredos do backend e exigir chave com pelo menos 32 bytes em produção.
  5. Transportar sessões em cookie HttpOnly, Secure em produção e SameSite=Lax; não persistir tokens no frontend.
  6. Exigir sessão autenticada e validar propriedade do usuário em cada rota que acesse dados pessoais.
  7. Utilizar consultas preparadas para prevenir SQL Injection.
  8. Retornar códigos HTTP apropriados sem expor segredos, hashes ou detalhes internos.
- **Critérios de Aceitação:**
  - Requisição com payload malicioso → Sistema rejeita.
  - Senhas armazenadas → Apenas em formato hash.
  - Cabeçalhos de segurança → Presentes em todas as respostas.
  - Requisição privada sem sessão ou com ID de outro usuário → Acesso negado.
  - Segredo de sessão ausente em produção → Backend não inicia.

---

### SR17 — Persistência de Dados em SQLite

- **ID:** SR17
- **RU Origem:** RU01, RU03, RU04, RU05, RU06
- **Ator(es):** S2
- **Prioridade:** P0
- **Descrição:** O sistema deve persistir todos os dados (usuários, humor, sono, energia, lembretes e sugestões) no banco de dados SQLite, utilizando o modo WAL (Write-Ahead Logging) para otimização de leitura e escrita.
- **Tabelas:**
  - `usuarios` (id, nome, email [único], senha, idade, ocupacao, data_cadastro)
  - `humor` (id, usuario_id [FK], emoji, data_registro)
  - `sono` (id, usuario_id [FK], horas_sono, qualidade, data_registro)
  - `energia` (id, usuario_id [FK], nivel_energia, data_registro)
  - `lembretes` (id, usuario_id [FK], titulo, icone, horario, concluido, data_criacao)
  - `sugestoes` (id, humor_tipo, titulo, descricao, icone)
- **Regras de Integridade:**
  1. Chave estrangeira `usuario_id` com `ON DELETE CASCADE`.
  2. Campo `email` com constraint `UNIQUE`.
  3. Índices nas colunas utilizadas frequentemente em consultas.
- **Critérios de Aceitação:**
  - Exclusão de usuário → Registros associados removidos automaticamente.
  - E-mail duplicado → Violação de constraint tratada pelo backend.
  - Modo WAL → Ativado na inicialização do banco.

---

### SR18 — Inicialização e Seed do Banco de Dados

- **ID:** SR18
- **RU Origem:** RU09
- **Ator(es):** S1, S2
- **Prioridade:** P0
- **Descrição:** O sistema deve executar o script `api/iniciarBanco.js` na inicialização, responsável por criar o banco, tabelas, índices, ativar o modo WAL e inserir as 12 sugestões padrão de autocuidado (2 por categoria de humor).
- **Regras de Processamento:**
  1. Criar banco SQLite caso não exista.
  2. Criar todas as tabelas com suas constraints e chaves estrangeiras.
  3. Criar índices para otimização de consultas.
  4. Ativar modo WAL.
  5. Verificar se tabela `sugestoes` está vazia.
  6. Se vazia → Inserir 12 sugestões padrão (feliz, triste, ansioso, cansado, irritado, neutro — 2 cada).
- **Critérios de Aceitação:**
  - Primeira execução → Banco criado com todas as tabelas e sugestões populadas.
  - Execução subsequente → Banco mantido, sugestões não duplicadas.

---

### SR19 — Dashboard Diário

- **ID:** SR19
- **RU Origem:** RU02, RU03, RU04, RU05, RU06, RU07, RU09
- **Ator(es):** A1 → Frontend
- **Prioridade:** P1
- **Descrição:** O sistema deve exibir um dashboard diário após a autenticação, consolidando os principais registros do usuário: humor atual, horas e qualidade do sono, nível de energia, lembretes pendentes e sugestões de autocuidado.
- **Componentes:**
  - Humor atual (emoji)
  - Sono do dia (horas + qualidade)
  - Energia do dia (nível 1–10)
  - Badge de lembretes pendentes
  - Sugestões de autocuidado (se humor registrado)
  - Gráficos de evolução (humor e sono)
- **Regras de Exibição:**
  1. Dados não preenchidos devem ser exibidos como "Não registrado".
  2. Sugestões só aparecem quando o humor do dia foi informado.
  3. Gráficos são renderizados com Chart.js.
- **Critérios de Aceitação:**
  - Todos os dados registrados → Dashboard completo exibido.
  - Dados parciais → Somente seções preenchidas exibidas, demais como "Não registrado".
  - Sem registros → Dashboard vazio com convite ao registro.

---

## 3. Matriz de Rastreabilidade Sistema → Usuário

| Requisito de Sistema | Requisito(s) de Usuário Atendido(s) |
|-----------------------|--------------------------------------|
| SR01 | RU01 |
| SR02 | RU01, RU03, RU04, RU05, RU06, RU10 |
| SR03 | RU02 |
| SR04 | RU02 |
| SR05 | RU03 |
| SR06 | RU04 |
| SR07 | RU05 |
| SR08 | RU06 |
| SR09 | RU07 |
| SR10 | RU08 |
| SR11 | RU08 |
| SR12 | RU09 |
| SR13 | RU10 |
| SR14 | RU11 |
| SR15 | N/A (infraestrutural) |
| SR16 | RU01, RU02, RU11 |
| SR17 | RU01, RU03, RU04, RU05, RU06 |
| SR18 | RU09 |
| SR19 | RU02, RU03, RU04, RU05, RU06, RU07, RU09 |

---

## 4. Diagrama de Pacotes Simplificado

```
┌─────────────────────────────────────────────────┐
│              DailyMind — Arquitetura            │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐    ┌───────────────────────┐  │
│  │   Frontend   │───▶│      Backend (API)     │  │
│  │  HTML/CSS/JS │    │  Node.js + Express     │  │
│  │  Chart.js    │    │                       │  │
│  └──────────────┘    │  ┌─────────────────┐  │  │
│                      │  │  Controladores  │  │  │
│                      │  │  - Usuario      │  │  │
│                      │  │  - Humor        │  │  │
│                      │  │  - Sono         │  │  │
│                      │  │  - Energia      │  │  │
│                      │  │  - Lembrete     │  │  │
│                      │  │  - Sugestao     │  │  │
│                      │  └────────┬────────┘  │  │
│                      │           │           │  │
│                      │  ┌────────▼────────┐  │  │
│                      │  │  Utilitários    │  │  │
│                      │  │  - Validadores  │  │  │
│                      │  └─────────────────┘  │  │
│                      └───────────┬───────────┘  │
│                                  │              │
│                      ┌───────────▼───────────┐  │
│                      │    Banco de Dados     │  │
│                      │       SQLite          │  │
│                      │   (modo WAL)          │  │
│                      └───────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 5. Premissas e Restrições

- A aplicação é uma SPA (Single Page Application) acessada via navegador web.
- Não há suporte a múltiplos idiomas na versão atual.
- O banco SQLite é adequado para a escala acadêmica do projeto.
- A persona Cuidador/Apoiador (A2) não será implementada nesta iteração.
- Todas as requisições HTTP devem seguir o prefixo `/api`.

---

## 6. Referências

- Requisitos de Usuário — DailyMind (documento complementar)
- Documentação Total DailyMind (brainstorming)
- UML 2.6.1 Specification — Object Management Group (OMG), 2024
- Express.js Documentation — https://expressjs.com
- SQLite Documentation — https://www.sqlite.org/docs.html
