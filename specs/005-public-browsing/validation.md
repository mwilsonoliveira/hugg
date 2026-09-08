# Validação — navegação pública

Data: 2026-09-08. Ambiente: build de produção local Next 14, Chrome headless, banco SQLite copiado para `/tmp/hugg-public-smoke.db`. Nenhum dado do banco original foi alterado pelos testes.

## Resultados

- `pnpm --filter @hugg/web test`: passou, incluindo destinos internos válidos e rejeição de destinos externos, codificados, ambíguos e de autenticação/API.
- `pnpm --filter @hugg/web type-check`: passou após regeneração dos tipos pelo build. A primeira execução detectou apenas referências antigas de `.next/types` ao grupo `(private)` removido.
- `pnpm --filter @hugg/web build`: passou, com home/detalhes dinâmicos e um único middleware. Avisos existentes de configuração ESM e catálogo Browserslist desatualizado, sem falha.
- Smoke HTTP: catálogo, detalhe, busca e proximidade públicos com cookie ausente, inválido, expirado e assinado com outra chave; cadastro, edição e upload retornam 401 nesses cenários; outro autor recebe 403; autor pode editar.
- Páginas protegidas redirecionam para login com destino preservado. A edição possui boundary de loading: o Next pode transmitir status 200 e meta de redirecionamento antes de resolver a página; a verificação cobre esse comportamento sem interpretar 200 como autorização.
- Chrome desktop 1280×900: busca anônima, CTA de cadastro, erro de login sem perder destino, login com retorno ao formulário, logout para home com Entrar.
- Chrome mobile 390×844: detalhe público com telefone/mapa, Entrar visível, ausência de overflow horizontal, busca, CTA de cadastro, retorno após login, confirmação de alterações não salvas (continuar/descartar), menu de conta e logout.
- Manutenção em processo separado: home mostra manutenção, API retorna 503 e `/health` retorna 200.
- `git diff --check` e `pnpm sdd:check`: passaram.

## Reprodução

A partir da raiz, prepare uma cópia descartável do banco local existente (com migrations aplicadas):

```sh
python3 - <<'PY'
import sqlite3
source = sqlite3.connect('file:packages/database/prisma/dev.db?mode=ro', uri=True)
target = sqlite3.connect('/tmp/hugg-public-smoke.db')
source.backup(target)
target.close()
source.close()
PY
pnpm --filter @hugg/web build
```

Em um terminal com diretório `apps/web`, inicie o servidor usando explicitamente a cópia:

```sh
TURSO_DATABASE_URL=file:/tmp/hugg-public-smoke.db JWT_SECRET=hugg-public-smoke-secret node_modules/.bin/next start -p 3102
```

Em outro terminal, abra um navegador com perfil exclusivo para teste:

```sh
google-chrome --headless=new --disable-gpu --no-first-run --no-default-browser-check --user-data-dir=/tmp/hugg-public-browser --remote-debugging-port=9227 about:blank
```

Na raiz, execute:

```sh
SMOKE_ISOLATED_DATABASE=true JWT_SECRET=hugg-public-smoke-secret node apps/web/scripts/public-access-smoke.mjs
pnpm --filter @hugg/web test
pnpm --filter @hugg/web type-check
pnpm sdd:check
```

O script usa Node 22 e Chrome DevTools Protocol, sem dependência nova. Cria dois usuários e um pet por execução no banco temporário, abre um contexto isolado no navegador e um servidor de manutenção na porta 3103; encerra ambos ao terminar. A imagem de exemplo é uma URL fictícia: a verificação cobre acesso aos dados e navegação, não disponibilidade do host de fotos ou tiles externos do Google Maps. O screenshot mobile fica em `/tmp/hugg-public-mobile.png`. Encerre o servidor 3102 e o Chrome de teste após a validação.

Deploy e validação de serviços externos não fazem parte desta entrega local. Não há migração persistente; rollback por reversão do código.
