#!/bin/bash
set -e

echo "🐳 Subindo containers..."
docker compose up -d

echo "⏳ Aguardando PostgreSQL ficar pronto..."
until docker compose exec -T postgres pg_isready -U hugg > /dev/null 2>&1; do
  sleep 1
done

echo "🗄️  Rodando migrations..."
cd apps/api && pnpm db:migrate

echo "⚙️  Gerando Prisma Client..."
pnpm db:generate

echo "🌱 Rodando seed..."
pnpm db:seed

echo "✅ Ambiente pronto!"
