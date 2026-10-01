# API Reference - Tasks and Goals

## Authentication and Sessions

Create an account or sign in. On success, the API sets an `HttpOnly` session cookie; browsers must send credentials on subsequent requests. The session expires after seven days and is revoked on logout.

```http
POST /usuarios/cadastro
Content-Type: application/json

{ "nome": "Nome", "email": "pessoa@example.com", "senha": "senha-com-pelo-menos-8-caracteres" }
```

```http
POST /usuarios/login
Content-Type: application/json

{ "email": "pessoa@example.com", "senha": "senha-com-pelo-menos-8-caracteres" }
```

```http
GET /usuarios/sessao
POST /usuarios/logout
```

All user-specific endpoints require the session cookie. The user ID in the URL or request body is not an authorization credential; access is restricted to the account represented by the session. Global `GET /sugestoes` remains public.

## Tasks (Tarefas) - Checklist Implementation

### Create Task
```http
POST /tarefas
Content-Type: application/json

{
  "usuario_id": 1,
  "titulo": "Estudar Node.js",
  "descricao": "Revisar conceitos de middleware",
  "icone": "📚"
}

Response (201):
{
  "sucesso": true,
  "mensagem": "Tarefa criada com sucesso!",
  "tarefa": {
    "id": 123,
    "usuario_id": 1,
    "titulo": "Estudar Node.js",
    "descricao": "Revisar conceitos de middleware",
    "icone": "📚",
    "concluido": 0,
    "data_criacao": "2026-09-01T10:30:00Z",
    "data_conclusao": null
  }
}
```

### List Tasks
```http
GET /tarefas/1?filtro=todas
GET /tarefas/1?filtro=pendentes
GET /tarefas/1?filtro=concluidas
GET /tarefas/item/123

Response (200):
{
  "sucesso": true,
  "dados": [
    {
      "id": 123,
      "usuario_id": 1,
      "titulo": "Estudar Node.js",
      "descricao": "Revisar conceitos de middleware",
      "icone": "📚",
      "concluido": 0,
      "data_criacao": "2026-09-01T10:30:00Z",
      "data_conclusao": null
    }
  ],
  "total": 1
}
```

### Get Today's Tasks
```http
GET /tarefas/1/hoje

Response (200):
{
  "sucesso": true,
  "dados": [...],
  "resumo": {
    "total": 5,
    "concluidas": 2,
    "pendentes": 3
  }
}
```

### Toggle Task Completion (Checkbox)
```http
PUT /tarefas/123/toggle

Response (200):
{
  "sucesso": true,
  "mensagem": "Tarefa concluída!",
  "tarefa": {
    "id": 123,
    "concluido": 1,
    "data_conclusao": "2026-09-01T14:45:00Z"
  }
}
```

### Update Task
```http
PUT /tarefas/123
Content-Type: application/json

{
  "titulo": "Estudar Node.js avançado",
  "descricao": "Revisar conceitos de middleware e rotas",
  "icone": "🚀"
}

Response (200):
{
  "sucesso": true,
  "mensagem": "Tarefa atualizada com sucesso!",
  "tarefa": {...}
}
```

### Delete Task
```http
DELETE /tarefas/123

Response (200):
{
  "sucesso": true,
  "mensagem": "Tarefa removida com sucesso!"
}
```

### Count Pending Tasks
```http
GET /tarefas/1/pendentes

Response (200):
{
  "sucesso": true,
  "total": 3
}
```

---

## Goals (Metas) - Period-Based Implementation

### Create Goal
```http
POST /metas
Content-Type: application/json

{
  "usuario_id": 1,
  "titulo": "Aprender TypeScript",
  "descricao": "Dominar tipos e interfaces do TypeScript",
  "icone": "🎯",
  "data_inicio": "2026-09-01",
  "data_fim": "2026-12-31"
}

Response (201):
{
  "sucesso": true,
  "mensagem": "Meta criada com sucesso!",
  "meta": {
    "id": 456,
    "usuario_id": 1,
    "titulo": "Aprender TypeScript",
    "descricao": "Dominar tipos e interfaces do TypeScript",
    "icone": "🎯",
    "data_inicio": "2026-09-01",
    "data_fim": "2026-12-31",
    "status": "em_andamento",
    "progresso": 8,
    "dias_restantes": 120,
    "data_criacao": "2026-09-01T10:30:00Z"
  }
}
```

### List Goals
```http
GET /metas/1?status=todas
GET /metas/1?status=não_iniciada
GET /metas/1?status=em_andamento
GET /metas/1?status=concluida
GET /metas/item/456

Response (200):
{
  "sucesso": true,
  "dados": [
    {
      "id": 456,
      "usuario_id": 1,
      "titulo": "Aprender TypeScript",
      "status": "em_andamento",
      "progresso": 8,
      "data_inicio": "2026-09-01",
      "data_fim": "2026-12-31",
      "dias_restantes": 120,
      ...
    }
  ],
  "total": 1
}
```

### Get Active Goals
```http
GET /metas/1/ativas

Response (200):
{
  "sucesso": true,
  "dados": [
    {
      "id": 456,
      "usuario_id": 1,
      "titulo": "Aprender TypeScript",
      "status": "em_andamento",
      "progresso": 8,
      "dias_restantes": 120,
      ...
    }
  ],
  "total": 1
}
```

### Get Goal Statistics
```http
GET /metas/1/estatisticas

Response (200):
{
  "sucesso": true,
  "estatisticas": {
    "total": 5,
    "não_iniciada": 1,
    "em_andamento": 2,
    "concluida": 2,
    "progresso_medio": 45
  }
}
```

### Update Goal
```http
PUT /metas/456
Content-Type: application/json

{
  "titulo": "Dominar TypeScript",
  "data_fim": "2027-01-31",
  "descricao": "Aprender tipos avançados, genéricos e decoradores"
}

Response (200):
{
  "sucesso": true,
  "mensagem": "Meta atualizada com sucesso!",
  "meta": {
    "id": 456,
    "titulo": "Dominar TypeScript",
    "status": "em_andamento",
    "progresso": 12,
    "dias_restantes": 153,
    ...
  }
}
```

### Update Goal Progress
```http
PUT /metas/456/progresso
Content-Type: application/json

{
  "progresso": 25
}

Response (200):
{
  "sucesso": true,
  "mensagem": "Progresso atualizado com sucesso!",
  "meta": {
    "id": 456,
    "progresso": 25
  }
}
```

The manual progress value is preserved in subsequent reads. Editing a goal's date range resets progress to the automatic period-based value.

### Delete Goal
```http
DELETE /metas/456

Response (200):
{
  "sucesso": true,
  "mensagem": "Meta removida com sucesso!"
}
```

---

## Status and Progress Information

### Task Status
- **concluido: 0** - Task is pending
- **concluido: 1** - Task is completed
- **data_conclusao** - Timestamp when task was marked as done (null if pending)

### Goal Status
- **status: "não_iniciada"** - Goal hasn't started yet (today < data_inicio)
- **status: "em_andamento"** - Goal is currently active (data_inicio <= today <= data_fim)
- **status: "concluida"** - Goal has ended (today > data_fim)

### Goal Progress
- **0-100** - Percentage of goal completion
- Auto-calculated based on elapsed time within the period
- Can be manually updated via `/metas/:id/progresso` endpoint
- **dias_restantes** - Number of days until goal end date

---

## Error Responses

### 422 - Validation Error
```json
{
  "sucesso": false,
  "mensagem": "Usuário e título são obrigatórios."
}
```

### 404 - Not Found
```json
{
  "sucesso": false,
  "mensagem": "Tarefa não encontrada."
}
```

---

## Database Indexes
For optimal performance, the following indexes have been created:
- `idx_tarefas_usuario` - Quick lookup by user
- `idx_tarefas_conclusao` - Filter by completion status
- `idx_metas_usuario` - Quick lookup by user
- `idx_metas_status` - Filter by status
