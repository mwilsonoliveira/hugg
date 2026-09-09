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

## Autenticação Google e modal (spec 006)

1. Aplique a nova migration `20260908000000_google_auth` com o runner de migrations antes de habilitar Google. Ela preserva usuários/hashes/relações, permite senha ausente para contas Google e cria o controle temporário de tentativas. Foi testada com dados relacionados e `foreign_key_check`; não execute o SQL de reconstrução manualmente fora do runner transacional.
2. No Google Cloud/Google Auth Platform, configure a tela de consentimento e um cliente OAuth do tipo Web. Em modo de testes, adicione os usuários que farão o smoke test.
3. Configure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e `GOOGLE_REDIRECT_URI` no ambiente correspondente. A última deve ser a URL absoluta exata, por exemplo `https://seu-dominio/api/auth/google/callback`, autorizada também no cliente Google.
4. Use um domínio estável de Preview para o callback e acesse o site por esse domínio. O início do Google rejeita origens diferentes da configurada; URLs temporárias de outros previews não compartilham automaticamente o callback. Use HTTPS em Production/Preview; `http://localhost:3000/api/auth/google/callback` funciona apenas em desenvolvimento.
5. Preserve `JWT_SECRET`, utilizado nas sessões e na proteção dos cookies temporários. Faça novo deploy após alterar variáveis.
6. Valide em Preview conta Google nova, conta já vinculada, e-mail de conta com senha, senha incorreta, confirmação bem-sucedida, cancelamento e retorno ao cadastro. O Google não recebe permissões de Drive/contatos: somente `openid email profile`.

Sem os três valores válidos, o botão Google fica desabilitado e explica que o usuário pode continuar com e-mail. Não é necessário Better Auth nem Map ID. A API Key de Maps continua separada dessas credenciais.

Rollback operacional: desabilite Google removendo sua configuração e mantenha a migration. Não publique código anterior que assume `passwordHash` obrigatório depois que contas exclusivamente Google existirem. Não aplique seed remoto sobre contas de usuários reais: seed é preparação controlada de dados, não gestão de credenciais.
