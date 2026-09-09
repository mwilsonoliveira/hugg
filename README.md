# hugg

Faça um animal desabrigado achar um lar.

Demo: [huggapp.vercel.app](https://huggapp.vercel.app)

## Arquitetura

Frontend e API rodam juntos no Next.js 14, publicados como um único projeto Vercel. Route Handlers ficam em `apps/web/src/app/api`, serviços em `apps/web/src/server` e Prisma em `packages/database`.

- Produção: Turso/libSQL e Vercel Blob público.
- Preview: banco Turso e Blob separados de produção.
- Desenvolvimento: SQLite local e Blob Store de desenvolvimento.
- Autenticação: cookie HTTP-only e compatibilidade com `Authorization: Bearer`.

## Desenvolvimento

Requisitos: Node.js 20+ e pnpm 9+.

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Web e API ficam em `http://localhost:3000`. Docker, PostgreSQL, Redis e um processo separado para a API não são necessários.

Na tela de login local, use o card **Acesso de teste local** ou informe:

```text
E-mail: admin@hugg.com
Senha:  hugg123456
```

O seed pode ser executado novamente para restaurar essa senha. Em desenvolvimento, fotos são gravadas em `apps/web/.local/uploads`; esse diretório é descartável e ignorado pelo Git. Preview e Production continuam usando Vercel Blob.

## Comandos úteis

| Comando | Descrição |
|---|---|
| `pnpm dev` | Inicia as aplicações |
| `pnpm build` | Gera o build completo |
| `pnpm type-check` | Valida os tipos |
| `pnpm db:generate` | Gera o Prisma Client |
| `pnpm db:migrate` | Aplica migrations SQLite/libSQL |
| `pnpm db:seed` | Cria o usuário local de teste |
| `pnpm db:studio` | Abre o Prisma Studio |
| `pnpm sdd:check` | Valida specs e rastreabilidade |

## Vercel

Configure o Root Directory como `apps/web`, vincule um Blob Store público e defina por ambiente:

| Variável | Production | Preview | Development |
|---|---|---|---|
| `TURSO_DATABASE_URL` | banco de produção | banco de preview | `file:../../packages/database/prisma/dev.db` |
| `TURSO_AUTH_TOKEN` | token de produção | token de preview | vazio |
| `JWT_SECRET` | preserve o segredo atual | segredo próprio | segredo local |
| `BLOB_READ_WRITE_TOKEN` | store de produção | store de preview | token de desenvolvimento |
| `MAINTENANCE_MODE` | `false` normalmente | `false` | `false` |

Nunca exponha tokens com prefixo `NEXT_PUBLIC_`. O provisionamento e o cutover estão em [docs/deployment.md](docs/deployment.md).

## Estrutura

```text
apps/
  web/                    Next.js, UI e Route Handlers
  mobile/                 Expo/React Native
packages/
  database/               Prisma, Turso e migrations
  schemas/                contratos Zod
  types/                  tipos compartilhados
  ui/ utils/ config/      pacotes compartilhados
specs/                    mudanças guiadas por SDD
```

## Spec-Driven Development

Antes de alterar código, leia [`AGENTS.md`](AGENTS.md) e a [constituição](.specify/memory/constitution.md). O fluxo é `constitution → spec → plan → tasks → implement → validate`; cada mudança vive em `specs/NNN-kebab-case/`.
