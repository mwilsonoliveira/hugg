FROM node:22-alpine

RUN npm install -g pnpm@9

WORKDIR /app

# Copia arquivos de dependências do monorepo
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/api/prisma ./apps/api/prisma
COPY apps/api/prisma.config.ts ./apps/api/prisma.config.ts
COPY packages/schemas/package.json ./packages/schemas/
COPY packages/utils/package.json ./packages/utils/
COPY packages/types/package.json ./packages/types/

# Instala dependências
RUN pnpm install --frozen-lockfile

# Copia o restante do código
COPY apps/api ./apps/api
COPY packages ./packages

# Build dos packages internos
RUN pnpm --filter @hugg/schemas build
RUN pnpm --filter @hugg/utils build
RUN pnpm --filter @hugg/types build

# Gera o Prisma Client
RUN pnpm --filter @hugg/api db:generate

# Build da API
RUN pnpm --filter @hugg/api build

EXPOSE 3001

CMD ["sh", "-c", "pnpm --filter @hugg/api exec prisma migrate deploy && node apps/api/dist/index.js"]
