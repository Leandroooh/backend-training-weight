# SimpleTasks API

API simples para gerenciamento de tarefas, construída com Fastify, Prisma e PostgreSQL. Fornece autenticação JWT, validação com Zod e documentação via Swagger UI.

## Principais tecnologias
- Node.js + TypeScript
- Fastify
- Prisma (Postgres)
- Zod (validação de esquemas)
- JWT (autenticação)
- Swagger UI (documentação)

## Estrutura principal
- src/server.ts — inicialização do servidor e plugins
- src/routes — rotas de auth e tasks
  - src/routes/auth/ — register/login
  - src/routes/tasks/ — CRUD de tarefas
- src/middlewares/AuthHandler.ts — middleware de autenticação (expõe getCurrentUserToken())
- src/prisma/client.ts — cliente Prisma
- prisma/schema.prisma — modelagem do banco
- src/@types/fastify.d.ts — augmentation de types do Fastify
- src/generated/prisma — arquivos gerados pelo Prisma

## Variáveis de ambiente (exemplo)
Crie um `.env` contendo pelo menos:
- DATABASE_URL=postgresql://user:password@localhost:5432/simplestasks_app
- JWT_SECRET=algum_segredo_super_secreto
- PORT=3000

## Como rodar (resumo)
1. Instale dependências:
   - pnpm install
2. Suba o banco (opcional com Docker Compose):
   - docker compose up -d
3. Gere cliente Prisma e migre:
   - pnpm prisma generate
   - pnpm prisma migrate deploy
4. Inicie em modo dev:
   - pnpm dev

## Documentação da API
A documentação interativa (Swagger / OpenAPI) está disponível em:
- http://localhost:3000/docs  
Use o Swagger UI para ver as rotas, parâmetros, esquemas e testar endpoints.

## Boas práticas / Observações
- As rotas privadas usam o middleware `AuthHandler` para validar o JWT.
- Valide o `JWT_SECRET` e `DATABASE_URL` em ambientes de produção.
- Ao alterar o schema do Prisma, gere e aplique migrações antes de rodar a aplicação.

## Contribuições
- Faça PRs pequenas e focadas.
- Ao alterar o schema, inclua migrações e execute `pnpm prisma generate`.
- Mantenha o código testável e com validação (Zod) nas rotas.