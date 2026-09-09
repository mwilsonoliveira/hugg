# Plano: adotar Spec-Driven Development

Spec: `specs/001-adopt-sdd/spec.md`  
Data: 2026-08-29

## Resumo técnico

Adicionar uma camada documental agnóstica composta por constituição, contextos, templates e specs; um adaptador Codex em `.agents/skills`; e um validador Node.js coberto por `node:test`.

## Contexto técnico

- Workspaces afetados: raiz do monorepo e documentação; apps/packages recebem somente `AGENTS.md` locais.
- Stack: Markdown, Node.js 20, pnpm e scripts ESM sem dependências.
- Persistência: N/A.
- Contratos públicos: dois comandos pnpm e o schema documental das features.
- Restrições: preservar runtime e evitar integração obrigatória com um agente ou CLI específicos.

## Checagem da constituição

O próprio trabalho estabelece e segue os princípios: distingue intenção/realidade, não altera contratos de produto, respeita os limites dos workspaces, não toca dados/segredos e cria evidência automatizada proporcional. Não há exceções.

## Decisões e fluxo de dados

`AGENTS.md` roteia o leitor para constituição, contexto por domínio, contexto local e feature ativa. Specs usam frontmatter simples; o validador percorre `specs/`, aplica regras conforme `track/status` e retorna diagnóstico determinístico. A skill local apenas orquestra esses artefatos.

## Contratos e modelo de dados

- Diretório: `specs/NNN-kebab-case/`.
- Frontmatter obrigatório: `id`, `title`, `status`, `track`, `created`, `updated`.
- IDs: `FR-###`, `NFR-###`, `SC-###` e tarefas `T###`.
- Tracks: `standard` e `fast`.
- Status: `draft`, `approved`, `planned`, `ready`, `implementing`, `done`, `superseded`.
- Comandos: `pnpm sdd:check` e `pnpm sdd:test`.

## Rastreabilidade

| Requisito | Decisão técnica | Verificação |
|---|---|---|
| FR-001 | Constituição, contextos centrais, domínios e AGENTS locais | inspeção de caminhos + `sdd:check` |
| FR-002 | Quatro templates em `.specify/templates` | inspeção + `sdd:check` |
| FR-003 | Skill `hugg-sdd` que referencia fontes canônicas | quick_validate da skill |
| FR-004 | Validador ESM e suíte `node:test` | `pnpm sdd:test` e cenários negativos |
| FR-005 | Feature `001-adopt-sdd`, índice e README | `sdd:check` + inspeção de links |
| NFR-001 | Contextos por escopo e skill fina, sem cópia de regras | revisão documental |
| NFR-002 | Somente módulos nativos do Node.js | inspeção de imports + testes |
| NFR-003 | Nenhum arquivo de runtime do produto alterado | revisão do diff + type-check |

## Sequência de implementação

1. Criar governança, contexto estável e instruções locais.
2. Criar templates, índice e skill operacional.
3. Implementar e testar o validador.
4. Registrar a feature bootstrap, atualizar README e validar o conjunto.

## Riscos, migração e rollback

- Risco: documentação excessiva para mudanças pequenas; mitigado pelo track `fast`.
- Risco: contexto ficar desatualizado; mitigado pela constituição e revisão junto com specs/código.
- Migração: não há dados ou consumidores externos a migrar.
- Rollback: remoção dos artefatos e comandos restaura o processo anterior sem impacto no produto.

## Aprovação

- Responsável: mantenedor do Hugg
- Data: 2026-08-29
- Decisão: aprovada

