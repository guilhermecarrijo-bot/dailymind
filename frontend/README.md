# Frontend do DailyMind

Interface web responsiva do DailyMind. O frontend é uma SPA sem etapa de build: usa HTML, CSS e JavaScript no navegador e consome a API Express do projeto.

## Arquivos

| Caminho | Responsabilidade |
|---|---|
| `index.html` | Estrutura das telas de autenticação, início, gráficos, lembretes, perfil e configurações |
| `css/estilo.css` | Estilos específicos para perfil, notificações, estados visuais e acessibilidade |
| `js/app.js` | Estado da interface, traduções, chamadas autenticadas à API e renderização de dados |

## Funcionalidades

- Cadastro, login e logout usando cookie de sessão `HttpOnly` emitido pela API.
- Registro e edição de humor, sono e energia, com histórico e gráficos dos últimos 30 dias.
- Criação, conclusão e remoção de lembretes no Início e na tela própria de lembretes.
- Perfil com edição de dados e imagens; configurações locais de idioma (português, inglês e espanhol), tema claro/preto e acessibilidade.

O frontend não oferece telas de tarefas ou metas. As rotas desses recursos continuam disponíveis diretamente na API.

## Integração com a API

As chamadas passam pela função `api()` em `js/app.js`, que usa `fetch` com `credentials: 'include'` para enviar o cookie de sessão. A aplicação é servida pelo backend em `/`; assim, a URL da API usa o caminho relativo `/api`. Ao servir o frontend separadamente na porta `8000`, o cliente usa `http://localhost:3000/api`, e essa origem precisa estar permitida em `ORIGEM_PERMITIDA`.

Principais rotas usadas pela interface:

| Recurso | Operações da interface |
|---|---|
| `/usuarios` | Cadastro, login, sessão, logout e perfil |
| `/humor`, `/sono`, `/energia` | Registros do dia, históricos e gráficos |
| `/lembretes` | Criar, listar, concluir/reabrir e remover |
| `/sugestoes` | Sugestões públicas e personalizadas pelo humor |

As rotas privadas exigem uma sessão válida. O backend determina o usuário pela sessão; o identificador enviado pelo cliente não concede acesso a dados de outra conta.

## Executar

Na raiz do projeto, inicie o backend com `api/iniciar-dailymind.bat` no Windows ou `bash api/iniciar-dailymind.sh` no Linux. O backend prepara `api/.env` quando necessário e serve os arquivos estáticos do frontend. Abra o endereço `http://localhost:3000` (ou a porta configurada em `api/.env`).

Para desenvolvimento separado, sirva `frontend/` em `http://localhost:8000` e mantenha o backend ativo na porta configurada. A API precisa permitir essa origem em `ORIGEM_PERMITIDA`.

Tailwind CSS e Chart.js são carregados por CDN no `index.html`; portanto, a conexão com a internet é necessária para esses recursos externos.