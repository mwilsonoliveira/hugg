# hugg
### Faça um animal desabrigado achar um lar!

Demo: [huggapp.vercel.app](https://huggapp.vercel.app)

---

## Requisitos

- [Node.js](https://nodejs.org) >= 20
- [pnpm](https://pnpm.io) >= 9
- [Docker](https://www.docker.com) + Docker Compose

---

## Instalação

```bash
pnpm install
```

---

## Subindo o ambiente de desenvolvimento

### 1. Variáveis de ambiente

Copie o arquivo de exemplo da API:

```bash
cp apps/api/.env.example apps/api/.env
```

O `.env` já vem configurado para apontar ao banco do Docker, nenhuma edição é necessária para rodar localmente.

### 2. Banco de dados + seed

O comando abaixo sobe os containers (PostgreSQL e Redis), aplica as migrations e popula o banco com dados de teste:

```bash
pnpm db:up
```

> Na primeira execução, o Prisma pedirá um nome para a migration. Dê o nome que preferir e pressione Enter.

### 3. Aplicações

Com o banco pronto, suba todas as aplicações em paralelo via Turborepo:

```bash
pnpm dev
```

| App | URL |
|-----|-----|
| Web (Next.js) | http://localhost:3000 |
| API (Fastify) | http://localhost:3001 |
| Mobile (Expo) | Escaneie o QR Code no terminal |

---

## Comandos úteis

| Comando | Descrição |
|---------|-----------|
| `pnpm db:up` | Sobe Docker + migrations + seed |
| `pnpm db:down` | Derruba os containers |
| `pnpm dev` | Inicia todas as apps |
| `pnpm build` | Build de todas as apps |
| `pnpm lint` | Lint em todos os pacotes |
| `pnpm type-check` | Type check em todos os pacotes |

### Comandos da API

Executados dentro de `apps/api/`:

| Comando | Descrição |
|---------|-----------|
| `pnpm db:migrate` | Aplica migrations pendentes |
| `pnpm db:generate` | Gera o Prisma Client |
| `pnpm db:seed` | Popula o banco com dados de teste |
| `pnpm db:studio` | Abre o Prisma Studio |

---

## Estrutura do monorepo

```
hugg/
├── apps/
│   ├── web/       → Next.js 14 (frontend web)
│   ├── mobile/    → Expo + React Native (app mobile)
│   └── api/       → Fastify + Prisma (backend)
├── packages/
│   ├── ui/        → Componentes React compartilhados
│   ├── schemas/   → Schemas Zod compartilhados
│   ├── types/     → Tipos TypeScript globais
│   ├── utils/     → Funções utilitárias
│   └── config/    → ESLint, TSConfig e Tailwind base
└── docker-compose.yml
```

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Web | Next.js 14, Tailwind CSS, shadcn/ui, Zustand |
| Mobile | Expo SDK 54, Expo Router, NativeWind |
| API | Fastify, Prisma v7, Better Auth, BullMQ |
| Banco | PostgreSQL + PostGIS, Redis |
