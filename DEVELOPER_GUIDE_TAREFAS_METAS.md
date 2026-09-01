# Tasks vs Goals - Developer Guide

## Architecture Overview

This refactoring separates two distinct entities that were previously merged:

### Tasks (Tarefas)
- **Purpose:** Quick action items that can be checked off
- **Behavior:** Binary state (done/pending)
- **Use Case:** Daily checklists, quick tasks, reminders
- **Data Model:** Similar to reminders but more structured
- **Status Tracking:** Simple checkbox (concluido: 0 or 1)

### Goals (Metas)
- **Purpose:** Long-term objectives with defined timeframes
- **Behavior:** Progress tracking over time
- **Use Case:** Monthly/quarterly/yearly objectives
- **Data Model:** Period-based with automatic status calculation
- **Status Tracking:** Based on date range (não_iniciada → em_andamento → concluida)

---

## Key Features

### Tasks Features
1. **Checkbox Completion**: Tasks toggle between done/pending
2. **Date Tracking**: Created and completion dates are recorded
3. **Filtering**: Can filter by completion status
4. **Daily View**: Can get all tasks for today with summary stats

### Goals Features
1. **Automatic Status Calculation**: Status changes based on current date
   ```javascript
   today < data_inicio → "não_iniciada"
   data_inicio <= today <= data_fim → "em_andamento"
   today > data_fim → "concluida"
   ```

2. **Automatic Progress Calculation**: Progress increases based on elapsed time
   ```
   progress = (elapsed_time / total_time) * 100
   ```

3. **Manual Progress Override**: Can manually set progress (0-100)

4. **Statistics**: Aggregate statistics by status and average progress

5. **Days Remaining**: Automatically calculated countdown

---

## Implementation Details

### Database Tables

#### tarefas
```sql
CREATE TABLE tarefas (
  id              INTEGER PRIMARY KEY,
  usuario_id      INTEGER,        -- Foreign key to usuarios
  titulo          TEXT NOT NULL,
  descricao       TEXT,
  icone           TEXT DEFAULT '✓',
  concluido       INTEGER DEFAULT 0,  -- 0 or 1
  data_criacao    TEXT,
  data_conclusao  TEXT,           -- Set when marked as done
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

#### metas
```sql
CREATE TABLE metas (
  id              INTEGER PRIMARY KEY,
  usuario_id      INTEGER,        -- Foreign key to usuarios
  titulo          TEXT NOT NULL,
  descricao       TEXT,
  icone           TEXT DEFAULT '🎯',
  data_inicio     TEXT NOT NULL,  -- YYYY-MM-DD
  data_fim        TEXT NOT NULL,  -- YYYY-MM-DD
  progresso       INTEGER DEFAULT 0,  -- 0-100
  status          TEXT DEFAULT 'não_iniciada',
  data_criacao    TEXT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

### Status Calculation Logic

Located in [metaControlador.js](src/controladores/metaControlador.js):

```javascript
function calcularStatus(data_inicio, data_fim) {
  const hoje = new Date()
  const inicio = new Date(data_inicio)
  const fim = new Date(data_fim)

  if (hoje < inicio) return 'não_iniciada'
  else if (hoje >= inicio && hoje <= fim) return 'em_andamento'
  else return 'concluida'
}
```

**Important:** This logic runs on every GET request to ensure real-time status updates.

### Progress Calculation Logic

```javascript
function calcularProgressoAutomatico(data_inicio, data_fim) {
  const hoje = new Date()
  const inicio = new Date(data_inicio)
  const fim = new Date(data_fim)

  if (hoje < inicio) return 0
  else if (hoje >= fim) return 100
  else {
    const totalMs = fim - inicio
    const decorridos = hoje - inicio
    return Math.round((decorridos / totalMs) * 100)
  }
}
```

**Note:** This provides automatic progress tracking. Users can override with manual progress updates.

---

## API Design Patterns

### Task Endpoints Pattern
```
POST   /tarefas                    - Create
GET    /tarefas/:usuario_id        - List with filters
GET    /tarefas/:usuario_id/hoje   - Today's tasks
GET    /tarefas/:usuario_id/pendentes - Count pending
GET    /tarefas/:id                - Get single
PUT    /tarefas/:id/toggle         - Toggle completion
PUT    /tarefas/:id                - Update
DELETE /tarefas/:id                - Delete
```

### Goal Endpoints Pattern
```
POST   /metas                      - Create
GET    /metas/:usuario_id          - List with status filters
GET    /metas/:usuario_id/ativas   - Active goals only
GET    /metas/:usuario_id/estatisticas - Stats
GET    /metas/:id                  - Get single
PUT    /metas/:id                  - Update
PUT    /metas/:id/progresso        - Update progress
DELETE /metas/:id                  - Delete
```

---

## Validation Strategy

### Task Validation
- Required: usuario_id (positive integer), titulo (3-255 chars)
- Optional: descricao (max 1000 chars), icone (max 10 chars)
- All text inputs are sanitized (escape + trim)

### Goal Validation
- Required: usuario_id, titulo, data_inicio, data_fim
- Title: 3-255 characters
- Description: max 1000 characters
- Dates: Must be valid ISO dates, fim > inicio
- All text inputs are sanitized

---

## Query Performance

Indexes have been added for common queries:
- `idx_tarefas_usuario` - For `WHERE usuario_id = ?`
- `idx_tarefas_conclusao` - For `WHERE concluido = ?`
- `idx_metas_usuario` - For `WHERE usuario_id = ?`
- `idx_metas_status` - For `WHERE status = ?`

---

## Future Enhancements

1. **Recurring Goals**: Add support for repeating goals
2. **Milestone Tracking**: Break goals into milestones
3. **Goal Dependencies**: Link goals together
4. **Notifications**: Alert when goals are nearing completion
5. **Historical Data**: Track progress changes over time
6. **Goal Templates**: Pre-made goal templates

---

## Migration Notes

If migrating from existing task/goal implementation:

1. **Database**: Run `iniciarBanco.js` to create new tables
2. **Controllers**: Replace old task/goal logic with new controllers
3. **Routes**: Update imports and add new endpoints
4. **Front-end**: Update to use specific endpoints for tasks vs goals
5. **Testing**: Test all CRUD operations for both entities

---

## Code Organization

```
api/
├── src/
│   ├── controladores/
│   │   ├── tarefaControlador.js    ← Task logic
│   │   ├── metaControlador.js      ← Goal logic
│   │   └── ...
│   ├── rotas/
│   │   └── dailyMindRotas.js       ← All endpoints
│   ├── config/
│   │   └── conexaoBanco.js         ← Database connection
│   └── utilitarios/
│       └── validadores.js          ← Validation functions
├── iniciarBanco.js                 ← Schema creation
└── API_REFERENCE_TAREFAS_METAS.md  ← API documentation
```

---

## Testing Recommendations

1. **Unit Tests**: Validator functions
2. **Integration Tests**: CRUD operations for both entities
3. **Status Calculation Tests**: Verify auto-status updates
4. **Progress Calculation Tests**: Verify auto-progress tracking
5. **Filtering Tests**: Verify query filters work correctly
6. **Date Validation Tests**: Ensure date validation prevents invalid data

---

## Common Pitfalls to Avoid

1. ❌ Don't use `ALTER TABLE` to modify schema in production
2. ❌ Don't trust client-provided dates without validation
3. ❌ Don't calculate status/progress at the database level (SQLite limitations)
4. ❌ Don't forget to sanitize user input
5. ❌ Don't delete goals without checking dependencies

---

## Support for Different Scenarios

### Scenario: User wants to create a quick checklist
→ Use **Tasks** endpoint

### Scenario: User wants to track progress on a 3-month project
→ Use **Goals** endpoint with date_inicio and date_fim

### Scenario: User wants to track both (e.g., daily tasks for a goal)
→ Create a Goal for the project, then create Tasks as sub-items (optional: add goal_id to tasks)

### Scenario: User needs reminders
→ Use existing **Lembretes** (reminders) endpoint
