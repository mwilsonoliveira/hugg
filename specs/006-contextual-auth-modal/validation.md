# Validação: modal contextual

Data: 2026-09-09.

## Evidências locais

- Testes web passaram: criptografia/adulteração/expiração do cookie, claims Google, verificação real de assinatura RSA com chaves de teste, audiência/emissor/nonce/e-mail verificado/expiração, callback de sucesso/cancelamento/replay, criação Google sem senha, login posterior, senha incorreta, vínculo concorrente, limite de cinco tentativas e contexto consumido.
- Testes database passaram: migration sobre usuários, pets e adoções existentes, preservação do hash, integridade das referências, conta sem senha e subject Google único.
- `pnpm --filter @hugg/web type-check`, `pnpm --filter @hugg/database type-check` e `pnpm --filter @hugg/schemas build` passaram. Mobile não consome as novas entradas; seus contratos existentes não foram alterados.
- Build de produção passou com `NEXT_TELEMETRY_DISABLED=1 node_modules/.bin/next build` em `apps/web`. Foi necessário executar fora do sandbox, que bloqueou canais internos do Next, e reconstruir os artefatos após uma execução interrompida. Permanecem avisos de ESM/Browserslist e log de detecção dinâmica da rota existente de proximidade, sem falha no build final.
- Smoke Chrome desktop 1280×900 e mobile 390×844 passou: modal mantém a home, layout cabe na tela, Tab circula dentro do dialog, Escape fecha e restaura foco/rolagem, cadastro e e-mail duplicado, recuperação de login incorreto, retorno ao cadastro e `/login` independente.
- Confirmação Google no navegador passou com contexto criptografado preparado pelo script: cancelamento, senha incorreta, vínculo correto e rejeição de reutilização. O provedor foi simulado; não houve autenticação externa real.
- Regressão `public-access-smoke.mjs` passou com o modal: catálogo/detalhes/busca/proximidade públicos, cookies inválidos/expirados/forjados, 401/403, autoria, confirmação de alterações não salvas, logout e modo de manutenção (API 503, health 200).
- `pnpm sdd:check` e `git diff --check` passaram; a pendência externa permanece registrada nas tarefas.
- Screenshots inspecionados: `/tmp/hugg-auth-desktop.png` e `/tmp/hugg-auth-mobile.png`. As imagens dos pets na base local dependem de URLs externas; isso não interfere no modal, que usa a marca Hugg para cadastro.
- Migration aplicada ao SQLite local após testes: comparação com `/tmp/hugg-before-google-auth-20260909.db` confirmou preservação integral dos campos antigos de User, Pet, Adoption e SearchHistory e `PRAGMA foreign_key_check` vazio. Nenhuma base remota foi alterada.

## Reprodução

Na raiz:

```sh
pnpm --filter @hugg/schemas build
pnpm --filter @hugg/database db:generate
pnpm --filter @hugg/web test
pnpm --filter @hugg/database test
pnpm --filter @hugg/web type-check
pnpm --filter @hugg/database type-check
pnpm sdd:check
```

Para navegador, use uma cópia descartável do SQLite com migrations aplicadas em `/tmp/hugg-auth-modal.db`. Com o servidor que usa o arquivo de origem parado, copie o banco local migrado para esse caminho. O script exige esse destino e cria contas de teste apenas nessa cópia.

Em `apps/web`, compile e inicie:

```sh
NEXT_TELEMETRY_DISABLED=1 node_modules/.bin/next build
TURSO_DATABASE_URL=file:/tmp/hugg-auth-modal.db JWT_SECRET=hugg-modal-smoke-secret node_modules/.bin/next start -p 3102
```

Em outro terminal, inicie Chrome com perfil exclusivo:

```sh
google-chrome --headless=new --disable-gpu --no-first-run --no-default-browser-check --user-data-dir=/tmp/hugg-public-browser --remote-debugging-port=9227 about:blank
```

Execute em `apps/web`:

```sh
SMOKE_ISOLATED_DATABASE=true TURSO_DATABASE_URL=file:/tmp/hugg-auth-modal.db JWT_SECRET=hugg-modal-smoke-secret node --import tsx scripts/auth-modal-smoke.mjs
SMOKE_ISOLATED_DATABASE=true JWT_SECRET=hugg-modal-smoke-secret node scripts/public-access-smoke.mjs
```

Os scripts usam contextos Chrome isolados e os encerram ao concluir. Encerre também o servidor e o Chrome de teste após a validação.

## Pendência externa

`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e `GOOGLE_REDIRECT_URI` não estão configuradas localmente. A autenticação com conta Google real em Preview não foi executada. Configuração e cenários estão em `docs/deployment.md`, seção “Autenticação Google e modal (spec 006)”. O botão fica desabilitado até os três valores estarem válidos. Não foi feito deploy nem alterado o Google Cloud.

A implementação local pode ser revisada; T006 permanece pendente e a spec não será marcada como done até a validação real em Preview.
