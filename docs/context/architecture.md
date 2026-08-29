# Arquitetura e estado atual

## Topologia

O Hugg é um monorepo pnpm/Turborepo:

- `apps/web`: Next.js 14 App Router, React 18 e Tailwind.
- `apps/mobile`: Expo SDK 54, Expo Router e NativeWind; atualmente um scaffold.
- `apps/api`: Fastify 4, Prisma 7 e PostgreSQL.
- `packages/schemas`: validações e contratos Zod.
- `packages/types`: tipos TypeScript globais.
- `packages/utils`: utilitários compartilhados.
- `packages/ui`: componentes React básicos.
- `packages/config`: configurações compartilhadas.

## Fluxo de dados

Web e, futuramente, mobile consomem a API REST. A API valida parte das entradas com Zod e persiste via Prisma/PostgreSQL. Redis, BullMQ e WebSocket estão declarados ou planejados, mas não participam dos fluxos atuais.

## Contratos HTTP observados

- Saúde: `GET /health`.
- Identidade: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`.
- Pets: `GET /api/pets`, `GET /api/pets/nearby`, `GET /api/pets/:id`, `POST /api/pets`, `PATCH /api/pets/:id`.
- Raças: `GET /api/breeds`.
- Pesquisas: `GET /api/searches`, `POST /api/searches`.

Não existe hoje um contrato OpenAPI versionado. Quando uma feature alterar ou ampliar endpoints, o plano deve decidir se introduz esse contrato e testes correspondentes.

## Persistência

Os modelos Prisma são `User`, `Pet`, `SearchHistory` e `Adoption`. O PostgreSQL local usa imagem com PostGIS, mas latitude e longitude são `Float` e a proximidade é calculada na aplicação. Redis sobe no Docker Compose, porém não é consumido pelo código observado.

## Autenticação e autorização

A API cria hashes bcrypt e tokens JWT com validade de sete dias. A web armazena o token em cookie HTTP-only e protege rotas pelo middleware. O endpoint de criação de pet não usa a identidade do token: associa o primeiro usuário encontrado. Endpoints de edição também não verificam propriedade. Essas limitações são dívidas atuais, não padrões a reproduzir.

## Deploy e operação

Há configurações para Vercel e Railway, Docker para API e workflows GitHub de deploy/migration. Os comandos de desenvolvimento canônicos ficam no `README.md`. Variáveis de ambiente e comportamento de produção devem ser confirmados nos manifests antes de qualquer mudança operacional.

## Divergências documentais conhecidas

- `README.md` e `SETUP.md` citam Better Auth, BullMQ, PostGIS e serviços de upload como stack/direção; integração efetiva não foi encontrada.
- `@hugg/types` e `@hugg/schemas` mantêm alguns tipos de domínio em paralelo, criando risco de divergência.
- Não há suíte automatizada de testes do produto nos manifests atuais.
- O changelog representa principalmente o setup inicial e não deve ser usado como inventário completo.

