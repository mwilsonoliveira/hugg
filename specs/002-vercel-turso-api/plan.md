# Plano: migrar API para Vercel e banco para Turso

Spec: `specs/002-vercel-turso-api/spec.md`  
Data: 2026-08-29

## Resumo técnico

Substituir Fastify por Route Handlers e serviços server-only no Next; criar `@hugg/database` com Prisma SQLite/libSQL; usar Vercel Blob client upload; adicionar migração PostgreSQL→Turso, maintenance mode e configuração por ambiente.

## Decisões

- Endpoints e respostas atuais permanecem; URLs passam a ser same-origin.
- `Pet.imageUrls` vira JSON internamente e continua `string[]` na API.
- Busca usa colunas normalizadas para remover dependência de `mode: insensitive` do PostgreSQL.
- Migrations remotas usam runner libSQL com tabela de controle; migrations PostgreSQL ficam arquivadas intactas.
- Produção preserva o JWT secret atual; cookie e Bearer são aceitos.
- Fotos públicas usam Blob, até cinco por pet e 5 MB cada.
- Cutover usa página de manutenção, Turso vazio, verificação e retenção Railway por sete dias.

## Rastreabilidade

| Requisito | Implementação | Verificação |
|---|---|---|
| FR-001 | Route Handlers e serviços Next | testes de handlers + smoke |
| FR-002 | `@hugg/database`, PrismaLibSQL e schema SQLite | testes com SQLite local |
| FR-003 | sessão server-only e checagem de autoria | testes 401/403/autoria |
| FR-004 | endpoint de token e upload client Blob | testes de política + preview |
| FR-005 | migrador e verificador PostgreSQL→Turso | fixture + dry-run/cutover |
| FR-006 | middleware e página de manutenção | teste de roteamento |
| NFR-001 | env server-only e CLI por stdin | revisão de bundle/logs |
| NFR-002 | runner/tabela de migrations | teste de idempotência |
| NFR-003 | credenciais por ambiente | inspeção Vercel/Turso |
| NFR-004 | runbook de cutover/rollback | checklist operacional |

## Migração e rollback

Provisionar e validar preview; criar produção vazia; dry-run; ativar manutenção; parar Railway; migrar e verificar; promover deployment; reter Railway desativado por sete dias. Antes da liberação, rollback reativa o deployment/serviço anterior. Depois de novas escritas no Turso, usar manutenção e forward-fix ou migração reversa controlada.

## Aprovação

- Responsável: mantenedor do Hugg
- Data: 2026-08-29
- Decisão: aprovada

