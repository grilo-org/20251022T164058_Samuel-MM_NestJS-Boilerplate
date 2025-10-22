## Boilerplate NestJS — Clean Architecture, DDD e SOLID

### Visão Geral

Este projeto é um boilerplate de API REST em NestJS com foco em Clean Architecture, DDD e SOLID. A aplicação adota separação por camadas e por feature (feature-by-folder), isolamento do domínio, casos de uso por ação, injeção de dependências por tokens e testes unitários/integrados.

### Arquitetura

- `src/shared` — elementos transversais:
  - `domain`: erros de domínio (`DomainError`, `NotFoundError`, `ConflictError`, ...)
  - `application`: contratos genéricos (`UseCase<Input, Output>`, providers como `HashProvider`) e DTOs comuns (paginação)
  - `infrastructure`: infraestrutura compartilhada (TypeORM via `DatabaseModule`, Swagger, filtros globais, integrações)
- `src/users` — contexto de usuários:
  - `domain`: `UserModel` (puro, sem ORM) e `users.repository.ts` (contrato do repositório no domínio)
  - `application`: `usecases` (Create/Find/List/Update/Delete) e DTOs específicos
  - `infrastructure`: `UserTypeormEntity` (ORM), `TypeormUsersRepository` (mapper Domain↔ORM), `UsersController`, `presenters`
- `src/auth` — contexto de autenticação:
  - `auth.module`, `auth.service`, `jwt.strategy`, `guards`, `infra/presenters`

Fluxo típico:
Controller → UseCase → Repository (domínio) → Infra (TypeORM) → DB → volta ao UseCase → Presenter (HTTP)

### Padrões e decisões

- Domínio puro: sem decorators/ORM. Infra mapeia Domain↔ORM.
- Casos de uso por ação com interface `UseCase<Input, Output>`.
- Erros de domínio mapeados para HTTP por filtro global.
- DTOs de entrada validados via `class-validator`; respostas via Presenters e Swagger com `getSchemaPath`.
- Alias de imports: `@/` aponta para `src/`.

### Stack

- Node 24, NestJS 11, TypeScript 5
- TypeORM (Postgres em runtime; SQLite em memória para integração)
- JWT, class-validator/transformer
- pnpm

### Executando

1. Dependências

```bash
pnpm install
```

2. Banco local (Postgres)

- Configure o `.env` com `DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, JWT_SECRET, JWT_EXPIRES`.
- Rode as migrations quando existirem:

```bash
pnpm migration:generate  # opcional, gera a partir das entidades
pnpm migration:run
```

3. Desenvolvimento

```bash
pnpm start:dev
# Swagger: http://localhost:3000/api/docs
```

4. Produção (Docker)

```bash
docker build -t base-api:prod .
docker run -p 3000:3000 --env-file .env base-api:prod
```

### Testes

- Unitários (Jest):

```bash
pnpm test
pnpm test:unit
```

- Integração (Nest Testing + Supertest + SQLite em memória):

```bash
pnpm test:int
```

### Convenções de código

- Clean Architecture/DDD:
  - Repositórios no domínio; implementação na infraestrutura com mappers
  - Casos de uso sem referências a framework
  - Presenters no boundary HTTP
- SOLID:
  - DIP: dependências por tokens (`'UsersRepository'`, `'HashProvider'`)
  - SRP: use cases por ação
  - LSP/ISP/OCP: contratos estáveis e composição
- Lint/Format:
  - ESLint (flat config) rígido, sem warnings no pre-commit (husky)
  - Prettier consistente

### Pastas Relevantes

- `src/main.ts`: bootstrap (prefixo /api, pipes, filters, Swagger em /api/docs)
- `src/shared/infrastructure/database`: TypeORM config e módulos
- `src/shared/infrastructure/exception-filters/all-exceptions.filter.ts`: mapeia erros de domínio para HTTP
- `src/users/...`: domínio, casos de uso, controllers e presenters de usuários
- `src/auth/...`: autenticação (login, JWT)

### Scripts

```bash
# Lint/format
pnpm lint
pnpm lint:fix

# Migrations (TypeORM CLI com data-source centralizado)
pnpm migration:generate src/shared/infrastructure/database/migrations/CreateUsers
pnpm migration:run
pnpm migration:revert
```

Para uso local sem exportar variáveis no shell (Node 20+):

```bash
pnpm migration:run:local
pnpm migration:revert:local
pnpm migration:generate:local
pnpm seed:ts:local
```

### Seeds (typeorm-seeding/typeorm-extension)

```bash
# Variáveis opcionais para o seed do admin
# SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD

pnpm seed
```

Arquivos:

- `src/shared/infrastructure/database/seeds/001-create-admin.seeder.ts`
- `src/shared/infrastructure/database/seeds/run-seeds.ts`
