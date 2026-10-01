DailyMind
---------------------
Integrantes: Ana Eduarda Sousa Silva Soares, Byank Chrystinny Santana Lima, Emanuele Oliveira Andrade, Guilherme dos Santos Carrijo e Maria Eduarda Pereira Sastre

Disciplina: Fábrica de Soluções Inteligentes

Professores: André Lôbo e Carlos Eduardo.
 
REQUISITOS DE USUÁRIO: 
---------------------------------------------------
RU01 — Criar uma conta pessoal
 O usuário deve poder criar uma conta informando nome, e-mail, senha, idade e ocupação, para utilizar o DailyMind de forma individualizada.

RU02 — Acessar seu espaço pessoal
 O usuário deve poder realizar login e acessar seus registros diários, lembretes, gráficos e sugestões de autocuidado.

RU03 — Registrar como está se sentindo
 O usuário deve poder informar seu humor diário por meio de emoções representadas por emojis, permitindo acompanhar suas variações ao longo do tempo.

RU04 — Acompanhar seu sono
 O usuário deve poder registrar quantas horas dormiu e avaliar a qualidade do sono, possibilitando identificar padrões em sua rotina.

RU05 — Informar seu nível de energia
 O usuário deve poder registrar seu nível de energia em uma escala de 1 a 10 para acompanhar como sua disposição varia durante os dias.

RU06 — Organizar atividades e compromissos
 O usuário deve poder criar lembretes para atividades importantes de sua rotina, como beber água, alimentar-se, estudar ou cumprir compromissos.

RU07 — Visualizar suas pendências
 O usuário deve conseguir identificar rapidamente quais lembretes ainda não foram concluídos, sem precisar consultar individualmente cada tarefa.

RU08 — Acompanhar sua evolução
 O usuário deve poder visualizar seu histórico de humor e sono por meio de gráficos, facilitando a percepção de mudanças em sua rotina.

RU09 — Receber sugestões de autocuidado
 O usuário deve receber sugestões simples e acolhedoras de autocuidado relacionadas ao humor registrado no dia.

RU10 — Personalizar suas informações pessoais
 O usuário deve poder atualizar seu nome, idade e ocupação sempre que essas informações forem alteradas.

RU11 — Organizar a rotina sem pressão
 O usuário deve conseguir utilizar lembretes e registros de forma simples, com notificações discretas e sem mecanismos que gerem cobrança ou penalização pelo não cumprimento de uma atividade.


REQUISITOS FUNCIONAIS:
---------------------------
RF01 — O sistema deve permitir o cadastro de usuários com nome, e-mail, senha, idade e ocupação.

RF02 — O sistema deve permitir que o usuário realize login, logout e mantenha sua sessão durante o acesso à aplicação.

RF03 — O sistema deve permitir que o usuário edite seus dados de perfil, como nome, idade e ocupação.

RF04 — O sistema deve permitir o registro diário do humor por meio de emojis, possibilitando atualizar o registro caso o humor do dia seja alterado.

RF05 — O sistema deve permitir o registro das horas e da qualidade do sono, mantendo essas informações associadas à data correspondente.

RF06 — O sistema deve permitir o registro do nível de energia em uma escala de 1 a 10 e sua consulta posteriormente.

RF07 — O sistema deve permitir a criação de lembretes personalizados, contendo título, ícone e horário opcional.

RF08 — O sistema deve permitir visualizar, concluir, reabrir e excluir lembretes cadastrados pelo usuário.

RF09 — O sistema deve apresentar um badge com a quantidade de lembretes pendentes, facilitando a identificação das atividades ainda não realizadas.

RF10 — O sistema deve apresentar sugestões de autocuidado relacionadas ao humor registrado no dia, considerando categorias como feliz, triste, ansioso, cansado, irritado e neutro.

RF11 — O sistema deve apresentar um dashboard diário contendo os principais registros do usuário, como humor, sono, energia e lembretes pendentes.

RF12 — O sistema deve disponibilizar gráficos de evolução do humor e das horas de sono, utilizando os registros anteriores do usuário.

RF13 — O sistema deve permitir a consulta do histórico de humor, sono e energia, possibilitando acompanhar mudanças ao longo do tempo.

RF14 — O sistema deve associar os registros ao usuário autenticado, garantindo que cada usuário visualize apenas seus próprios dados.

RF15 — O sistema deve validar os dados inseridos pelo usuário antes de armazená-los no banco de dados, rejeitando informações inválidas.

RF16 — O sistema deve armazenar os dados dos usuários, registros diários, lembretes e sugestões no banco de dados SQLite, permitindo sua recuperação posteriormente.

RF17 — O sistema deve apresentar mensagens de sucesso ou erro após operações realizadas pelo usuário, como cadastro, login e registro de informações.


RF18 — O sistema deve oferecer notificações e indicadores visuais discretos, auxiliando na organização da rotina sem utilizar mensagens de cobrança ou punição.




DOCUMENTAÇÃO DE PROJETO: DAILYMIND
-----------------------------------------

1. Visão Geral do Projeto


- Nome do Projeto: DailyMind

- Proposta: Desenvolver um aplicativo móvel voltado para pessoas neurodivergentes e/ou com dificuldades severas de organização, promovendo o acompanhamento do autocuidado, regulação do humor e organização da rotina de forma adaptada, leve e sem sobrecarga.


2. Mapeamento de Problema e Solução

 2.1. O Problema: Muitas pessoas com divergências cognitivas (como TDAH, Autismo, ansiedade ou outros perfis neurodivergentes) enfrentam grandes barreiras para manter a consistência em rotinas básicas diárias e na gestão de materiais.

- Impactos na rotina: Desorganização de materiais de estudo/trabalho (livros, cadernos, folhas, objetos de uso diário) e esquecimento de tarefas essenciais de autocuidado (beber água, alimentar-se, tomar banho, tomar medicações, cumprir horários).


- Consequências emocionais e funcionais: Perda de tempo, atrasos e não entrega de tarefas, perda de foco, sobrecarga mental e constante desânimo. Isso prejudica diretamente o desempenho acadêmico/profissional, a autonomia e a qualidade de vida.


2.2. A Solução Proposta:
O DailyMind consiste em uma plataforma acessível e intuitiva que oferece um sistema de suporte à rotina diária através de:

- Lembretes Leves e Adaptados: Notificações não punitivas para tarefas essenciais do dia a dia e autocuidado.


- Registro de Bem-Estar: Funcionalidades para acompanhamento diário de humor, qualidade do sono e níveis de energia.


- Análise de Padrões: Exibição visual de histórico que permite ao usuário e aos seus apoiadores identificar oscilações de comportamento e progresso ao longo do tempo.


3. Público-Alvo e Mapas de Empatia: 

Para garantir o alinhamento do design e das funcionalidades com as reais necessidades dos usuários, o projeto baseia-se em duas personas principais: o Usuário Final (Ex:Luana) e o Apoiador/Cuidador.

3.1. Persona 1: Luana (Usuário Final)
-------------------------------------------

- Perfil: Pessoa neurodivergente ou com dificuldades de organização, regulação do humor e autocuidado.

Dimensão e Descrição

- O que fala e faz? 

Tenta criar rotinas e se organizar, mas costuma abandonar hábitos com o tempo. Alterna períodos de alta produtividade com momentos de desânimo, procrastinação e paralisia diante de tarefas básicas.

- O que pensa e sente?

Sente cansaço, desmotivação e frustração por não manter a constância. Deseja estabilidade emocional, maior controle sobre o dia a dia e autonomia.

- O que escuta?

Comentários como "você precisa se esforçar mais", conselhos genéricos de produtividade, cobranças frequentes e comparações com rotinas "típicas/ideais".

- O que vê?

Pressionada pela escola, família e sociedade; rodeada por distrações e pela sensação de que os outros se organizam facilmente. Nota a escassez de ferramentas adaptadas ao seu funcionamento.

- Dores

Esquecimento de compromissos; dificuldade em manter o autocuidado; ansiedade, oscilações de humor e sensação contínua de sobrecarga mental.

- Ganhos desejados 

Manter uma rotina saudável, reduzir a ansiedade, acompanhar o humor, ganhar previsibilidade e sentir-se autônoma e no controle da própria vida.

 3.2. Persona 2: Cuidador / Responsável
----------------------------------

- Perfil: Pessoa que convive com o neurodivergente (mãe, pai, parceiro(a), responsável ou cuidador).


Dimensão e Descrição

- O que fala e faz?

Procura constantemente estratégias para ajudar na rotina, relembra tarefas do diário, oferece apoio emocional e busca reduzir a sobrecarga do neurodivergente.

- O que pensa e sente?

Preocupação constante com o futuro e o bem-estar da pessoa. Sente-se sobrecarregada, por vezes impotente ou insegura sobre qual a melhor forma de ajudar sem tirar a autonomia do outro.

- O que escuta?

Julgamentos externos, opiniões contraditórias sobre saúde mental e educação, além do desabafo do próprio neurodivergente sobre suas frustrações diárias.

- O que vê?

Acompanha de perto as crises de ansiedade, o esquecimento recorrente, as oscilações de humor e a falta de soluções práticas no mercado que atendam às necessidades reais da família.

- Dores

Desgaste emocional; dificuldade em encontrar suporte adequado; falta de ferramentas adaptadas à dinâmica familiar; receio sobre a independência do familiar.

- Ganhos desejados

Redução do estresse diário, melhoria na comunicação, maior autonomia para o familiar e uma rotina mais pacífica e previsível para a casa.

4. Diretrizes de UX/UI (Experiência e Interface do Usuário)
Design Anti-Sobrecarga: Cores suaves, tipografia legível e uso mínimo de elementos ruidosos na tela.


- Comunicação Não Punitiva: Sem penalidades, alertas vermelhos agressivos ou sequências impostas que gerem culpa no usuário ao falhar em cumprir uma tarefa.


- Flexibilidade: Permitir reajustes fáceis de rotina nos dias de baixa energia.
 
Documentação Técnica do DailyMind:
-------------------------------------------------

5 . Frontend — Interface
---------------------------

5.1 Linguagens e tecnologias

O frontend do DailyMind é desenvolvido como uma aplicação web do tipo SPA (Single Page Application), utilizando tecnologias nativas da web.

- As principais tecnologias utilizadas são:

HTML5 Semântico: responsável pela estrutura das páginas e organização dos elementos da interface.

CSS3: utilizado para estilos adicionais e personalizações visuais.

Tailwind CSS: framework CSS utilizado para facilitar a criação de uma interface responsiva e consistente.

JavaScript ES6+: responsável pela lógica da aplicação, interação com o usuário e comunicação com a API.

Fetch API: utilizada no JavaScript para realizar requisições HTTP ao backend.

Chart.js: utilizada para a criação dos gráficos de evolução de humor e sono.

O projeto não utiliza React, Flutter ou Swift. A interface foi desenvolvida utilizando HTML, CSS e JavaScript Vanilla, tornando a aplicação mais simples e adequada à proposta acadêmica.

5.2 Estrutura de pastas
--------------

A estrutura principal do frontend está organizada da seguinte forma:

frontend/

├── css/

│   └── estilo.css

├── js/

│   └── app.js

└── index.html

- index.html

É o arquivo principal da aplicação. Contém a estrutura das telas e os elementos HTML utilizados pelo usuário.

- css/estilo.css 

Contém estilos adicionais utilizados para complementar o Tailwind CSS e personalizar a aparência da aplicação.

- js/app.js

Concentra a lógica do frontend, incluindo autenticação, comunicação com a API, manipulação dos registros, lembretes, sugestões e criação dos gráficos.

5.3 Principais telas e componentes
--------------------------

O frontend possui uma área pública e uma área autenticada.

- Tela de cadastro: permite que o novo usuário informe nome, e-mail, senha, idade e ocupação para criar sua conta.

- Tela de login: permite informar e-mail e senha para acessar a conta existente.

- Dashboard: é a principal tela após a autenticação. Apresenta um resumo das informações do dia, incluindo:

 humor atual;

horas e qualidade do sono;

nível de energia;

lembretes pendentes;

sugestões de autocuidado;

gráficos de evolução.

- Registro de humor: apresenta opções de emojis para que o usuário selecione como está se sentindo.

- Registro de sono: permite informar as horas dormidas e a qualidade do sono.

- Registro de energia: permite selecionar um nível de energia de 1 a 10.

- Área de lembretes: permite criar, visualizar, concluir, reabrir e excluir lembretes.

- Badge de pendências: apresenta visualmente a quantidade de lembretes que ainda não foram concluídos.

- Gráficos: desenvolvidos com Chart.js para apresentar a evolução dos registros de humor e sono.

- Perfil: permite atualizar informações pessoais, como nome, idade e ocupação


6 . Backend — Regras do Sistema 
--------------------------------------

6.1 Tecnologias


- O backend do DailyMind é desenvolvido em JavaScript utilizando Node.js.As principais tecnologias utilizadas são:

- Node.js: ambiente de execução do JavaScript no servidor.

- Express.js: framework utilizado para criação do servidor HTTP e das rotas da API.

- better-sqlite3: biblioteca responsável pela comunicação com o banco SQLite.

- Helmet: adiciona cabeçalhos HTTP relacionados à segurança.

- CORS: controla as origens que podem realizar requisições à API.

- Validator: utilizado para validação e sanitização de dados.

- Dotenv: permite utilizar variáveis de ambiente.

- Crypto: utilizado para realizar o hash das senhas.

- Fetch API: utilizada pelo frontend para consumir os endpoints do backend.

O servidor é iniciado pela estrutura:

api/

├── src/

│   ├── config/

│   │   └── conexaoBanco.js

│   ├── controladores/

│   │   ├── usuarioControlador.js

│   │   ├── humorControlador.js

│   │   ├── sonoControlador.js

│   │   ├── energiaControlador.js

│   │   ├── lembreteControlador.js

│   │   ├── sugestaoControlador.js

│   │   └── leadControlador.js

│   ├── rotas/

│   │   ├── dailyMindRotas.js

│   │   └── leadRotas.js

│   ├── utilitarios/

│   │   └── validadores.js

│   ├── app.js

│   └── server.js

├── iniciarBanco.js

└── package.json

O módulo de leads permanece no projeto apenas como código legado e não participa das rotas ativas da aplicação.

6.2 Rotas e APIs
------------------

A API utiliza o prefixo /api.

- Usuários

POST /api/usuarios/cadastro — cria uma nova conta.

POST /api/usuarios/login — autentica um usuário.

PUT /api/usuarios/perfil — atualiza os dados do perfil.

- Humor

POST /api/humor — registra ou atualiza o humor do dia.

GET /api/humor/:usuario_id — consulta os últimos 30 registros de humor.

GET /api/humor/:usuario_id/hoje — consulta o humor registrado no dia atual.

- Sono

POST /api/sono — registra ou atualiza o sono do dia.

GET /api/sono/:usuario_id — consulta os últimos 30 registros de sono.

GET /api/sono/:usuario_id/hoje — consulta o sono do dia atual.

- Energia

POST /api/energia — registra ou atualiza o nível de energia.

GET /api/energia/:usuario_id — consulta os últimos 30 registros.

GET /api/energia/:usuario_id/hoje — consulta a energia registrada no dia.

- Lembretes

POST /api/lembretes — cria um lembrete.

GET /api/lembretes/:usuario_id — lista os lembretes do usuário.

PUT /api/lembretes/:id/toggle — alterna entre concluído e pendente.

DELETE /api/lembretes/:id — exclui um lembrete.

GET /api/lembretes/:usuario_id/pendentes — retorna a quantidade de lembretes pendentes.

- Sugestões

GET /api/sugestoes/:usuario_id — retorna sugestões relacionadas ao humor do dia.

GET /api/sugestoes — retorna todas as sugestões cadastradas.
Sistema

GET /api/health — verifica se a API está funcionando.


6.3 Regras de negócio
--------------------

O backend é responsável por receber, validar, processar e armazenar as informações enviadas pelo frontend.

- Cadastro e autenticação

No cadastro, o sistema recebe os dados do usuário e verifica se o e-mail já existe. Caso esteja disponível, a senha é transformada em hash utilizando crypto antes de ser armazenada.

No login, o sistema verifica o e-mail e compara a senha informada com o hash armazenado. Em caso de sucesso, os dados básicos do usuário são retornados ao frontend.

- Registros diários

Os registros de humor, sono e energia são associados ao usuário e à data em que foram realizados.

Quando o usuário já possui um registro para o dia atual, o sistema realiza uma atualização em vez de criar outro registro, evitando duplicidade.

- Lembretes

Cada lembrete pertence a um usuário e pode possuir:

título;

ícone;

horário;

estado de conclusão.

O usuário pode alternar o estado do lembrete entre pendente e concluído ou removê-lo.

O backend também calcula a quantidade de lembretes pendentes, utilizada pelo frontend para exibir o badge.

- Sugestões personalizadas

As sugestões são relacionadas a categorias de humor. Por exemplo, quando o usuário registra um humor classificado como ansioso, o backend pode retornar sugestões cadastradas para essa categoria.

As sugestões são armazenadas previamente na tabela sugestoes e podem ser consultadas pela API.

- Validação e segurança

O backend possui mecanismos para:

- validar os dados recebidos;

- limitar o tamanho dos payloads;

- utilizar consultas preparadas;

- aplicar cabeçalhos de segurança com Helmet;

- controlar CORS;

- utilizar hash para armazenamento das senhas;

- retornar códigos HTTP apropriados para erros e operações.

7 . Banco de Dados — Armazenamento
--------------------------

7.1 Tipo de banco
------------

O DailyMind utiliza o SQLite, um banco de dados relacional.

A comunicação entre o backend e o banco é realizada por meio da biblioteca better-sqlite3.

O banco é armazenado localmente no arquivo:

api/db/dailymind.db

O SQLite foi escolhido por ser leve, simples de configurar e adequado para uma aplicação acadêmica que não necessita de uma infraestrutura de banco de dados separada.

O banco também utiliza o modo WAL (Write-Ahead Logging) para melhorar o comportamento das operações de leitura e escrita.

7.2 Modelagem
--------------

O banco possui cinco tabelas principais:

- usuarios

Armazena as informações das contas.

usuarios

├── id

├── nome

├── email

├── senha

├── idade

├── ocupacao

└── data_cadastro


O campo id identifica cada usuário. O campo email é único para impedir contas duplicadas.

- humor

Armazena os registros emocionais.

humor

├── id

├── usuario_id

├── emoji

└── data_registro

O campo usuario_id estabelece a relação entre o registro de humor e o usuário.

Relação:

usuarios 1 ───────── N humor

Um usuário pode possuir vários registros de humor.

- sono

Armazena as informações relacionadas ao sono.

sono
├── id

├── usuario_id

├── horas_sono

├── qualidade

└── data_registro

Relação:

usuarios 1 ───────── N sono

Um usuário pode possuir vários registros de sono ao longo dos dias.

- energia

Armazena o nível de energia registrado pelo usuário.

energia

├── id

├── usuario_id

├── nivel_energia

└── data_registro

Relação:

usuarios 1 ───────── N energia

- lembretes

Armazena as atividades e compromissos criados pelo usuário.

lembretes

├── id

├── usuario_id

├── titulo

├── icone

├── horario

├── concluido

└── data_criacao

Relação:

usuarios 1 ───────── N lembretes

Cada lembrete pertence a um único usuário.


- sugestoes

Armazena as sugestões de autocuidado disponibilizadas pela aplicação.

sugestoes

├── id

├── humor_tipo

├── titulo

├── descricao

└── icone

Essa tabela não possui usuario_id, pois as sugestões são padrões compartilhados pelo sistema. Elas são selecionadas de acordo com o tipo de humor registrado pelo usuário.

7.3 Relacionamento entre as tabelas
---------------------------------------

A estrutura geral do banco pode ser representada da seguinte maneira:

                       
                        
                        ┌──────────────┐
                        |  USUARIOS    │ 
                        └──────┬───────┘
                               │
            ┌───────────┬────── ──┬────────────┐───────┐ 
            |           |         |            |       |                                                     
            ▼           ▼         ▼            ▼       |                                                                    
        ┌───────┐   ┌───────┐ ┌───────┐ ┌──────────┐   |    
        │ HUMOR     │ SONO  | |ENERGIA| │LEMBRETES |   │         
        └───────┘   └───────┘ └───────┘ └──────────┘   |
                                                       |                                                                     
                         ┌──────────────┐              |                                           
                         │  SUGESTOES   │◄─────────────┘                          
                         └──────────────┘

A relação principal é entre usuarios e as tabelas de dados pessoais. Cada registro possui uma chave estrangeira usuario_id.

Além disso, as tabelas utilizam ON DELETE CASCADE, fazendo com que os registros relacionados sejam removidos caso o usuário seja excluído.

8 . Dados iniciais e popularização do banco
--------------------------------

A criação e inicialização do banco são realizadas pelo arquivo:

api/iniciarBanco.js

Ao iniciar o projeto, esse arquivo:

1 - cria o banco SQLite caso ele ainda não exista;

2 - cria as tabelas necessárias;

3 - cria os índices utilizados nas consultas;

4 - configura o banco para utilização do modo WAL;

5 - verifica se a tabela sugestoes está vazia;

6 - insere as 12 sugestões padrão de autocuidado quando necessário.

As sugestões são distribuídas entre as categorias:

- feliz;

- triste;

- ansioso;

- cansado;

- irritado;

- neutro.

Dessa forma, o sistema já possui dados básicos para que a funcionalidade de sugestões possa ser testada imediatamente após a inicialização.

Os demais dados, como usuários, registros de humor, sono, energia e lembretes, são criados durante a utilização da aplicação.

Fluxo geral da aplicação
--------------------------
- USUÁRIO

   │

   ▼

- FRONTEND

HTML + CSS + JavaScript

   │

   │ Fetch / HTTP

   ▼

- BACKEND

Node.js + Express

   │

   ├── Autenticação

   ├── Validação

   ├── Regras de negócio

   ├── Humor

   ├── Sono

   ├── Energia

   ├── Lembretes

   └── Sugestões

   │

   ▼

- BANCO DE DADOS

SQLite

   │

   ├── usuarios

   ├── humor

   ├── sono


   ├── energia

   ├── lembretes

   └── sugestoes

Esse fluxo representa a arquitetura Full Stack do DailyMind: o frontend é responsável pela interação com o usuário, o backend processa as requisições e regras do sistema, e o banco de dados mantém as informações armazenadas.



