# Changelog

## Setup inicial

### Estrutura do monorepo
- Configuração do Turborepo + pnpm workspaces
- `turbo.json`, `pnpm-workspace.yaml`, `package.json` raiz, `.gitignore`

---

### `apps/api` — Fastify + Prisma + PostgreSQL
- Schema Prisma com models `User`, `Pet`, `Adoption` e enums `Species`, `PetStatus`, `AdoptionStatus`, `Situation`
- `prisma.config.ts` para Prisma v7
- Singleton do Prisma Client com adapter pg
- Rota `GET /api/pets` com busca, filtro por tempo de espera e paginação
- CORS configurado
- Seed com 6 pets e 2 usuários

### `apps/web` — Next.js 14
- Estrutura de rotas `(private)` e `(public)`
- `/home` — home com listagem de pets
- `/login` — página de login

### `apps/mobile` — Expo SDK 54 + NativeWind
- `app.json`, `babel.config.js`, `metro.config.js`, `global.css`
- Configuração do NativeWind com preset e tipos

---

### Packages compartilhados

| Package | Conteúdo |
|---|---|
| `@hugg/types` | `User`, `Pet`, `Adoption`, `Species`, `PetStatus`, `Situation` |
| `@hugg/schemas` | Schemas Zod: `createPet`, `listPetsQuery`, `petResponse`, `paginatedPets`, `createAdoption`, `registerUser`, `login` |
| `@hugg/utils` | `formatPetAge`, `getDistanceKm`, `speciesLabel`, `situationLabel`, `waitingDays`, `waitingLabel` |
| `@hugg/ui` | `Button`, `Badge` |
| `@hugg/config` | `tsconfig.base.json`, `tailwind.config.base`, `eslint.config.base` |

---

### Infraestrutura
- `docker-compose.yml` com PostgreSQL 16 + PostGIS e Redis 7
- Script `scripts/dev-up.sh` — sobe Docker, aguarda Postgres, roda migrations e seed
- Comandos `pnpm db:up` e `pnpm db:down` na raiz

---

## Home page (web)

### Componentes
- `PetCard` — scroll de fotos com setas e dots, botão coração, nome, situação e dias de espera
- `PetFilters` — botão "Achei um pet!", campo de busca e dropdown de filtro por tempo de espera
- `PetCardSkeleton` — skeleton animado com `animate-pulse`
- `PetList` — Client Component com:
  - Debounce de 500ms no campo de busca
  - Tempo mínimo de exibição do skeleton (600ms via `Promise.all`)
  - Paginação com botão "Carregar mais"
  - Estado inicial `loading: true` para evitar flash dos dados do servidor

### Página
- `page.tsx` — Server Component que faz o fetch inicial e passa os dados ao `PetList`
- Grid responsivo: 1 coluna (mobile) → 2 (sm) → 3 (md) → 4 (xl)
- 12 itens por página para preencher o grid em todas as resoluções
