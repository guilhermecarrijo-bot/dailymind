# Frontend do DailyMind

Interface web responsiva do DailyMind. O frontend é uma SPA que usa HTML, CSS e JavaScript no navegador e consome a API Express do projeto.

## CSS (Tailwind)

O arquivo `css/tailwind.css` é gerado pela Tailwind CLI e fica versionado, pois o deploy não executa build do frontend. Ao adicionar ou alterar classes no HTML ou no JavaScript, gere o arquivo novamente dentro de `frontend/` e inclua-o no commit:

```bash
npm install
npm run build:css
```

Durante o desenvolvimento, use `npm run watch:css`.

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

## Recursos PWA

O `manifest.webmanifest` e o `service-worker.js` permitem instalar o DailyMind e abrir a interface em modo autônomo. O Service Worker guarda localmente o HTML, o CSS, os scripts, o manifesto e os ícones; requisições `/api` não são armazenadas em cache.

O módulo `js/pwa-offline.js` enfileira no IndexedDB (com fallback para `localStorage`) somente escritas de humor, sono, energia, lembretes e perfil quando a rede falha. Ao recuperar a conexão, a fila é reenviada com a sessão atual e a interface é atualizada. Login, cadastro, logout e ações administrativas nunca são enfileirados.

## Executar

Na raiz do projeto, inicie o backend com `api/iniciar-dailymind.bat` no Windows ou `bash api/iniciar-dailymind.sh` no Linux. O backend prepara `api/.env` quando necessário e serve os arquivos estáticos do frontend. Abra o endereço `http://localhost:3000` (ou a porta configurada em `api/.env`).

Para desenvolvimento separado, sirva `frontend/` em `http://localhost:8000` e mantenha o backend ativo na porta configurada. A API precisa permitir essa origem em `ORIGEM_PERMITIDA`.

Tailwind CSS e Chart.js são carregados por CDN no `index.html`; portanto, a conexão com a internet é necessária para esses recursos externos.