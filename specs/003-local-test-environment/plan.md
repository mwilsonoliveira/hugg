# Plano: preparar ambiente local para cadastro de pets

Spec: `specs/003-local-test-environment/spec.md`  
Data: 2026-08-29

## Resumo técnico

Restringir o seed padrão a SQLite local, exibir uma conta de teste no login apenas em development e adicionar upload/serving local autenticado, mantendo Vercel Blob nos builds de produção.

## Decisões

- O seed usa upsert e redefine a senha local para garantir acesso reproduzível.
- Banco remoto exige `ALLOW_REMOTE_SEED=true`, `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD` explícitos.
- Arquivos ficam em `apps/web/.local/uploads`, fora do Git, com UUID e extensão derivada do MIME.
- O cliente escolhe upload local por `NODE_ENV === "development"`; produção conserva o fluxo Blob.

## Rastreabilidade

| Requisito | Implementação | Verificação |
|---|---|---|
| FR-001 | seed idempotente e upsert | seed repetido + login |
| FR-002 | credenciais passadas pela página e card no formulário | type-check + build |
| FR-003 | POST/GET local e integração do dropzone | testes de validação + smoke |
| FR-004 | branch de produção preserva Blob | build de produção |
| NFR-001 | guarda de banco remoto | teste de configuração |
| NFR-002 | UUID, validação e gitignore | testes unitários |
| NFR-003 | estado e mensagens no dropzone | inspeção + type-check |

## Riscos e rollback

O diretório local é descartável e pode ser removido sem afetar o banco remoto. Rollback remove as rotas locais e restaura o seed anterior; nenhuma migration é necessária.

## Aprovação

- Responsável: mantenedor do Hugg
- Data: 2026-08-29
- Decisão: aprovada
