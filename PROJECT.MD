# MVP — Registro de Cargas de Treino

## Resumo
**Objetivo:** Permitir que o usuário registre treinos e cargas por exercício (nome, série, carga, data, treino do dia), com histórico e exportação básica.  
**Escopo do MVP:** CRUD de treinos e entradas de exercício, listagem por data, e exportação simples em CSV/PDF.  
**Autenticação:** Não será incluída no MVP inicial (pode ser adicionada depois).

---

## Conceitos Centrais
**Workout (Treino):** Representa uma sessão de treino diária.  
Atributos: `id`, `name`, `date`, `notes`, `createdAt`.

**ExerciseEntry (Entrada de Exercício):** Registro de um exercício dentro de um treino.  
Atributos: `id`, `workoutId`, `exerciseName`, `series`, `weight`, `createdAt`.

Cada entrada registra *séries com uma única carga*. Repetições individuais por série não serão modeladas no MVP.

---

## Modelo de Dados (estrutura conceitual)
Formato inspirado em Prisma:

- `Workout`: contém informações do treino.
- `ExerciseEntry`: pertence a um Workout e registra dados do exercício.

---

## Contratos de API
### Criar treino
**POST** `/workouts`  
Body: `{ "name": "...", "date": "YYYY-MM-DD", "notes": "..." }`  
Response: `201` com dados do Workout.

### Listar treinos por intervalo
**GET** `/workouts?from=YYYY-MM-DD&to=YYYY-MM-DD`  
Response: `200` com lista de Workouts + suas Entries.

### Buscar treino por id
**GET** `/workouts/:id`  
Response: `200` com Workout + Entries.

### Adicionar entrada a um treino
**POST** `/workouts/:id/entries`  
Body: `{ "exerciseName": "...", "series": 3, "weight": 80 }`  
Response: `201` com a nova Entry.

### Editar entrada
**PATCH** `/entries/:id`  
Permite atualizar `series` e `weight`.

### Remover entrada
**DELETE** `/entries/:id`

### Exportar dados
**GET** `/export?format=csv&from=...&to=...`  
Gera CSV ou PDF.

### Validações
- Respostas de erro padronizadas: `400` com campo `errors`.
- Validação recomendada com Zod.

---

## Regras de Negócio / UX
- Data padrão: hoje (com opção de selecionar outra).
- `series` deve ser inteiro ≥ 1.
- `weight` deve ser número ≥ 0.
- Listagem agrupada por data e por treino, ordenada por `date DESC`.
- Edição rápida de `series` e `weight`.
- Export CSV com colunas: `date`, `workoutName`, `exerciseName`, `series`, `weight`.
- Histórico com filtros por data e busca por `exerciseName`.

---

## Front-end — Wireframe / Fluxo
- **Tela principal:** calendário + lista de treinos do dia.
- **Formulário rápido:** nome do treino, data e botão para adicionar entrada.
- **Entrada inline:** exercício, séries, carga (kg), salvar/remover.
- **Histórico:** filtros por intervalo de datas + busca textual.
- **Exportação:** botão para exportar CSV e opção para PDF.
- **Implementação inicial:** HTML estático com JS (fetch) ou React + Vite para evolução futura.

---

## Stack Recomendado
- **Backend:** Fastify + TypeScript (ou Express).  
- **ORM:** Prisma com SQLite (MVP) → Postgres (produção).  
- **Validação:** Zod.  
- **Frontend:** Vanilla JS ou React + Vite.  
- **Deploy:** Railway, Render ou Vercel (frontend).  
- **Exportação:** geração local de CSV/PDF; S3 apenas se necessário armazenar arquivos.

---

## Segurança / Autenticação (opcional)
- MVP inicial sem autenticação.  
- Para multiusuário: adicionar tabela `User`, JWT e vínculo `userId` → `Workout`.  
- Proteger rotas de escrita e exportação.

---

## Persistência & Migrações
- Utilizar Prisma com `prisma generate` e `prisma migrate dev`.  
- SQLite no protótipo; Postgres ao escalar.

---

## Testes & Qualidade
- **Unitários:** validação dos payloads (Zod).  
- **Integração:** testes dos endpoints (Jest + supertest).  
- **E2E (opcional):** Playwright ou Cypress.

---

## Estrutura de Arquivos Sugerida
