# Plano: navegação pública e login sob demanda

Spec: `specs/005-public-browsing/spec.md`
Data: 2026-09-08

## Resumo técnico e decisões

- FR-001/FR-002: substituir o grupo private por site com layout compartilhado sem bloqueio global; consultas públicas permanecem inalteradas.
- FR-003/NFR-001: páginas servidor de cadastro e edição exigem sessão; edição mantém autoria e APIs mantêm 401/403. Extrair formulário cliente do cadastro.
- FR-004/NFR-001: `/login?next=...` com validação central de destinos internos de páginas existentes, alternativa `/`, preservação em erros e uso nas ações de login/registro. Logout para `/` e sessão válida no login segue destino.
- FR-005: home aceita sessão opcional; apresentação de conta compartilhada oferece Entrar para visitante e menu para autenticado. Manter confirmação de alterações não salvas.
- NFR-001: consolidar middleware em src/middleware.ts, preservando manutenção e health, removendo proteção global e `/home` antigo. Autorização nas páginas/serviços servidor.

## Contexto técnico e constituição

Workspace afetado: @hugg/web; documentação SDD/contextos. Next 14 e dependências existentes. Sem novas dependências, migrations, mudança de API REST ou OpenAPI. Server Components verificam sessão assinada e existência de usuário. Não expor identidade em respostas públicas. Manter TypeScript estrito, responsividade e testes proporcionais. Nenhuma exceção à constituição.

## Sequência e verificação

Registrar spec/plano aprovados e tarefas; adicionar testes de destinos; implementar rotas e sessão; ajustar navegação; verificar HTTP e navegador em desktop/mobile, manutenção, autenticação inválida e autorização; executar testes, type-check, build e sdd:check.

## Riscos, migração e rollback

Regressão de acesso mitigada por testes de rotas e 401/403, sem depender de JWT decodificado no cliente. Sem migração persistente; rollback revertendo código. Deploy não faz parte da execução local.

## Aprovação

- Responsável: mantenedor do Hugg
- Data: 2026-09-08
- Decisão: aprovada pelo pedido de implementação do plano apresentado na conversa.
