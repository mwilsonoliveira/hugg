# Deploy Vercel + Turso

## Provisionamento

1. Instale e autentique os CLIs: `pnpm dlx vercel login` e `turso auth login`.
2. Crie `hugg-production` e `hugg-preview` com `turso db create <nome>`.
3. Obtenha URLs com `turso db show <nome> --url` e tokens com `turso db tokens create <nome>`.
4. Na Vercel, use Root Directory `apps/web` e crie Blob Stores públicos separados para Production e Preview.
5. Configure `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `JWT_SECRET`, `BLOB_READ_WRITE_TOKEN` e `MAINTENANCE_MODE`. Tokens e `JWT_SECRET` devem ser sensitive.
6. Aplique migrations com `pnpm --filter @hugg/database db:migrate` usando as variáveis de cada ambiente.

O CLI permite `vercel env add TURSO_DATABASE_URL production --sensitive`. Use `vercel env pull .env.local` para desenvolvimento e não versione o arquivo.

## Cutover de produção

1. Valide integralmente um Preview contra o banco e Blob de Preview.
2. Ensaie a migração com uma cópia recente e confira usuários, pets, buscas, adoções e imagens.
3. Preserve exatamente o `JWT_SECRET` atual para não invalidar sessões.
4. Ative `MAINTENANCE_MODE=true` na Vercel e publique.
5. Interrompa a API Railway para congelar escritas.
6. Aplique as migrations no Turso de produção.
7. Execute em `packages/database`: `RAILWAY_DATABASE_URL=... TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... BLOB_READ_WRITE_TOKEN=... pnpm db:migrate:railway`.
8. O script valida as quatro contagens. Faça smoke tests de login, listagem, criação, edição pelo proprietário, busca e upload.
9. Defina `MAINTENANCE_MODE=false` e publique novamente.
10. Mantenha Railway desligado, mas recuperável, por ao menos sete dias.

Não reexecute a cópia sobre um Turso que já recebeu dados. Depois de novas escritas no Turso, volte à manutenção e faça correção progressiva em vez de retornar ao banco antigo.
