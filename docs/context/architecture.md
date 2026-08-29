# Arquitetura e estado atual

## Topologia

O Hugg é um monorepo pnpm/Turborepo:

- `apps/web`: Next.js 14 App Router, React 18 e Tailwind.
- `apps/mobile`: Expo SDK 54, Expo Router e NativeWind; atualmente um scaffold.
- `apps/web/src/app/api`: Route Handlers que executam junto do Next na Vercel.
- `packages/database`: Prisma 7, adaptador libSQL, schema SQLite e migrations Turso.
- `packages/schemas`: validações e contratos Zod.
- `packages/types`: tipos TypeScript globais.
- `packages/utils`: utilitários compartilhados.
- `packages/ui`: componentes React básicos.
- `packages/config`: configurações compartilhadas.

## Fluxo de dados

O navegador consome a API REST same-origin. Server Components e Server Actions chamam serviços diretamente, sem HTTP interno. Entradas são validadas com Zod e persistidas via Prisma/libSQL; fotos públicas ficam no Vercel Blob.

## Contratos HTTP observados

- Saúde: `GET /health` (e alias `GET /api/health`).
- Identidade: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`.
- Pets: `GET /api/pets`, `GET /api/pets/nearby`, `GET /api/pets/:id`, `POST /api/pets`, `PATCH /api/pets/:id`.
- Raças: `GET /api/breeds`.
- Pesquisas: `GET /api/searches`, `POST /api/searches`.

Não existe hoje um contrato OpenAPI versionado. Quando uma feature alterar ou ampliar endpoints, o plano deve decidir se introduz esse contrato e testes correspondentes.

## Persistência

Os modelos Prisma são `User`, `Pet`, `SearchHistory` e `Adoption`. Produção e preview usam bancos Turso separados; desenvolvimento usa SQLite local. `Pet.imageUrls` é JSON internamente e `string[]` no contrato. A proximidade continua calculada na aplicação.

## Autenticação e autorização

A aplicação cria hashes bcrypt e tokens JWT com validade de sete dias. A web usa cookie HTTP-only e a API também aceita Bearer. Criação exige autenticação e associa o usuário real; edição exige que o usuário seja o autor do pet.

## Deploy e operação

Web e API são um único deployment Vercel. Migrations Turso são aplicadas fora das requisições por um runner versionado. Railway e as migrations PostgreSQL permanecem somente como origem/arquivo para o cutover descrito em `docs/deployment.md`.

## Divergências documentais conhecidas

- `@hugg/types` e `@hugg/schemas` mantêm alguns tipos de domínio em paralelo, criando risco de divergência.
- Não há suíte automatizada de testes do produto nos manifests atuais.
- O changelog representa principalmente o setup inicial e não deve ser usado como inventário completo.
