# Requisitos de Usuário — DailyMind

**Projeto:** DailyMind  
**Disciplina:** Fábrica de Soluções Inteligentes  
**Professores:** André Lôbo e Carlos Eduardo.  
**Integrantes:** Ana Eduarda Sousa Silva Soares, Byank Chrystinny Santana Lima, Emanuele Oliveira Andrade, Guilherme dos Santos Carrijo e Maria Eduarda Pereira Sastre. 
**Versão do Modelo:** UML 2.6.1 (2026)  
**Data de Elaboração:** 31/08/2026

---

## 1. Escopo e Visão Geral

O presente documento formaliza os **Requisitos de Usuário (RU)** do sistema DailyMind, refinados a partir das ideias levantadas na sessão de brainstorming do projeto. Cada requisito é descrito seguindo a convenção UML 2.0+ (2026), incluindo identificador único, descrição textual estruturada, restrições, critérios de aceitação e classificação de prioridade.

### 1.1 Classificação de Prioridades

| Nível | Descrição |
|-------|-----------|
| **P0** | Essencial — o sistema não pode ser entregue sem este requisito |
| **P1** | Importante — necessário para a experiência completa do usuário |
| **P2** | Desejável — agrega valor, pode ser implementado em iterações futuras |

### 1.2 Atores Identificados

| ID | Ator | Descrição |
|----|------|-----------|
| **A1** | Usuário Final | Pessoa neurodivergente ou com dificuldades de organização que utiliza o DailyMind para acompanhamento de autocuidado, humor e rotina. |
| **A2** | Cuidador/Apoiador | Pessoa que convive com o Usuário Final e deseja apoiar sua rotina (persona secundária — funcionalidade futura). |

---

## 2. Requisitos de Usuário

### RU01 — Criar uma Conta Pessoal

- **ID:** RU01
- **Ator:** A1 (Usuário Final)
- **Prioridade:** P0
- **Descrição:** O Usuário deve poder criar uma conta pessoal informando nome completo, e-mail, senha, idade e ocupação, para utilizar o DailyMind de forma individualizada.
- **Restrições:**
  - O e-mail informado deve ser único no sistema.
  - A senha deve possuir no mínimo 6 caracteres.
  - A idade deve ser um número inteiro positivo.
- **Critérios de Aceitação:**
  - Cenário 1: Cadastro válido → O sistema cria a conta e redireciona o usuário para a tela de login.
  - Cenário 2: E-mail duplicado → O sistema exibe mensagem de erro indicando que o e-mail já está em uso.
  - Cenário 3: Dados inválidos → O sistema rejeita o cadastro e indica quais campos possuem erros.

---

### RU02 — Acessar o Espaço Pessoal

- **ID:** RU02
- **Ator:** A1 (Usuário Final)
- **Prioridade:** P0
- **Descrição:** O Usuário deve poder realizar login com e-mail e senha, acessando seu dashboard pessoal contendo registros diários, lembretes, gráficos e sugestões de autocuidado.
- **Restrições:**
  - A sessão deve ser mantida enquanto o usuário estiver ativo na aplicação.
  - O logout deve encerrar a sessão e redirecionar para a tela de login.
- **Critérios de Aceitação:**
  - Cenário 1: Credenciais corretas → O sistema autentica e exibe o dashboard.
  - Cenário 2: Credenciais incorretas → O sistema exibe mensagem de erro sem revelar qual campo está incorreto.
  - Cenário 3: Logout → A sessão é encerrada e o acesso direto às rotas autenticadas é bloqueado.

---

### RU03 — Registrar Humor Diário

- **ID:** RU03
- **Ator:** A1 (Usuário Final)
- **Prioridade:** P0
- **Descrição:** O Usuário deve poder informar seu humor diário por meio de emojis representativos (feliz, triste, ansioso, cansado, irritado, neutro), permitindo acompanhar suas variações ao longo do tempo.
- **Restrições:**
  - É permitido apenas um registro de humor por dia por usuário.
  - Caso o usuário já tenha registrado humor no dia, o novo registro substitui o anterior.
- **Critérios de Aceitação:**
  - Cenário 1: Primeiro registro do dia → O sistema armazena o humor associado à data atual.
  - Cenário 2: Atualização no mesmo dia → O sistema sobrescreve o registro anterior mantendo a mesma data.
  - Cenário 3: Consulta de humor atual → O sistema retorna o emoji registrado no dia corrente.

---

### RU04 — Acompanhar Qualidade do Sono

- **ID:** RU04
- **Ator:** A1 (Usuário Final)
- **Prioridade:** P0
- **Descrição:** O Usuário deve poder registrar quantas horas dormiu e avaliar a qualidade do sono (bom, regular, ruim), possibilitando identificar padrões em sua rotina ao longo do tempo.
- **Restrições:**
  - É permitido apenas um registro de sono por dia por usuário.
  - As horas de sono devem ser um número real entre 0 e 24.
- **Critérios de Aceitação:**
  - Cenário 1: Registro válido → O sistema armazena horas e qualidade associadas à data atual.
  - Cenário 2: Registro duplicado no dia → O sistema atualiza o registro existente.
  - Cenário 3: Dados fora do intervalo → O sistema rejeita e exibe mensagem de erro.

---

### RU05 — Informar Nível de Energia

- **ID:** RU05
- **Ator:** A1 (Usuário Final)
- **Prioridade:** P0
- **Descrição:** O Usuário deve poder registrar seu nível de energia em uma escala de 1 a 10, permitindo acompanhar como sua disposição varia durante os dias.
- **Restrições:**
  - É permitido apenas um registro de energia por dia por usuário.
  - O valor deve ser um número inteiro entre 1 e 10.
- **Critérios de Aceitação:**
  - Cenário 1: Registro válido → O sistema armazena o nível de energia com a data atual.
  - Cenário 2: Atualização no mesmo dia → O sistema sobrescreve o registro anterior.
  - Cenário 3: Valor fora da escala → O sistema rejeita e exibe mensagem de erro.

---

### RU06 — Organizar Atividades e Compromissos

- **ID:** RU06
- **Ator:** A1 (Usuário Final)
- **Prioridade:** P1
- **Descrição:** O Usuário deve poder criar lembretes para atividades importantes de sua rotina, como beber água, alimentar-se, estudar ou cumprir compromissos, definindo título, ícone e horário opcional.
- **Restrições:**
  - Cada lembrete deve pertencer a um único usuário.
  - O título é obrigatório; o horário é opcional.
- **Critérios de Aceitação:**
  - Cenário 1: Criação válida → O sistema armazena o lembrete e o exibe na lista do usuário.
  - Cenário 2: Título vazio → O sistema rejeita a criação e solicita o preenchimento do campo.

---

### RU07 — Visualizar Pendências

- **ID:** RU07
- **Ator:** A1 (Usuário Final)
- **Prioridade:** P1
- **Descrição:** O Usuário deve conseguir identificar rapidamente quais lembretes ainda não foram concluídos, sem precisar consultar individualmente cada tarefa, por meio de um indicador visual (badge) com a quantidade de pendências.
- **Restrições:**
  - O indicador deve ser atualizado em tempo real ao concluir ou reabrir lembretes.
- **Critérios de Aceitação:**
  - Cenário 1: Lembretes pendentes → O badge exibe a quantidade correta de pendências.
  - Cenário 2: Todos concluídos → O badge não é exibido ou exibe zero.

---

### RU08 — Acompanhar Evolução Pessoal

- **ID:** RU08
- **Ator:** A1 (Usuário Final)
- **Prioridade:** P1
- **Descrição:** O Usuário deve poder visualizar seu histórico de humor e sono por meio de gráficos, facilitando a percepção de mudanças em sua rotina ao longo do tempo.
- **Restrições:**
  - Os gráficos devem exibir os últimos 30 registros disponíveis.
  - Os dados devem ser filtrados exclusivamente pelo Usuário autenticado.
- **Critérios de Aceitação:**
  - Cenário 1: Dados suficientes → O sistema exibe gráfico com os registros disponíveis.
  - Cenário 2: Sem registros → O sistema exibe mensagem indicando que não há dados para exibir.

---

### RU09 — Receber Sugestões de Autocuidado

- **ID:** RU09
- **Ator:** A1 (Usuário Final)
- **Prioridade:** P1
- **Descrição:** O Usuário deve receber sugestões simples e acolhedoras de autocuidado relacionadas ao humor registrado no dia, considerando as categorias: feliz, triste, ansioso, cansado, irritado e neutro.
- **Restrições:**
  - As sugestões são definidas pelo sistema com base no humor atual.
  - As sugestões não devem conter teor de cobrança ou julgamento.
- **Critérios de Aceitação:**
  - Cenário 1: Humor registrado → O sistema exibe sugestões da categoria correspondente.
  - Cenário 2: Humor não registrado → O sistema não exibe sugestões até que o humor seja informado.

---

### RU10 — Personalizar Informações Pessoais

- **ID:** RU10
- **Ator:** A1 (Usuário Final)
- **Prioridade:** P2
- **Descrição:** O Usuário deve poder atualizar seu nome, idade e ocupação sempre que essas informações forem alteradas, mantendo seu perfil sempre atualizado.
- **Restrições:**
  - O e-mail não pode ser alterado após o cadastro.
  - Os campos nome, idade e ocupação são editáveis a qualquer momento.
- **Critérios de Aceitação:**
  - Cenário 1: Atualização válida → O sistema salva as alterações e confirma ao usuário.
  - Cenário 2: Campos obrigatórios vazios → O sistema rejeita a atualização e solicita preenchimento.

---

### RU11 — Organizar Rotina Sem Pressão

- **ID:** RU11
- **Ator:** A1 (Usuário Final)
- **Prioridade:** P0
- **Descrição:** O Usuário deve conseguir utilizar lembretes e registros de forma simples, com notificações discretas e sem mecanismos que gerem cobrança, punição ou penalização pelo não cumprimento de uma atividade.
- **Restrições:**
  - O sistema não deve exibir alertas vermelhos agressivos ou mensagens de culpa.
  - Não deve haver sequências impostas ou restrições de uso por falha em cumprir tarefas.
  - O design deve seguir princípios de acessibilidade e anti-sobrecarga.
- **Critérios de Aceitação:**
  - Cenário 1: Lembrete não concluído → O sistema mantém o lembrete pendente sem penalizar o usuário.
  - Cenário 2: Dias de baixa energia → O usuário pode reajustar sua rotina facilmente.
  - Cenário 3: Notificações → As notificações são discretas e não utilizam linguagem punitiva.

---

## 3. Matriz de Rastreabilidade Usuário → Sistema

| Requisito de Usuário | Requisito(s) de Sistema Relacionado(s) |
|-----------------------|----------------------------------------|
| RU01 | SR01, SR02 |
| RU02 | SR03, SR04 |
| RU03 | SR05 |
| RU04 | SR06 |
| RU05 | SR07 |
| RU06 | SR08 |
| RU07 | SR09 |
| RU08 | SR10, SR11 |
| RU09 | SR12 |
| RU10 | SR13 |
| RU11 | SR14 |

---

## 4. Premissas e Dependências

- O sistema será acessado por meio de navegador web (SPA).
- O banco de dados SQLite será utilizado para persistência local.
- A aplicação é voltada para uso acadêmico e inicialmente suportará apenas um único perfil de usuário (Usuário Final).
- A persona Cuidador/Apoiador (A2) será considerada em iterações futuras do projeto.

---

## 5. Referências

- Documentação Total DailyMind (brainstorming)
- UML 2.6.1 Specification — Object Management Group (OMG), 2024
- Booch, G., Rumbaugh, J., & Jacobson, I. *The Unified Modeling Language User Guide*, 3rd Edition, 2025
