# Especificações do Hugg

Cada mudança SDD vive em `specs/NNN-kebab-case/`. A numeração é crescente e nunca é reutilizada.

## Ciclo de vida

| Status | Significado | Artefatos mínimos |
|---|---|---|
| `draft` | Intenção em esclarecimento | `spec.md` |
| `approved` | Intenção aprovada | `spec.md` |
| `planned` | Estratégia aprovada | `spec.md`, `plan.md` |
| `ready` | Execução liberada | `spec.md`, `plan.md`, `tasks.md`, checklist |
| `implementing` | Tarefas em execução | mesmos de `ready` |
| `done` | Implementação e evidências concluídas | todos os artefatos e checkboxes concluídos |
| `superseded` | Substituída por outra spec | `spec.md` apontando a sucessora |

O track `fast` pode permanecer apenas com `spec.md`; ao chegar a `done`, seus critérios e aprovação devem estar concluídos no próprio arquivo.

## Processo

1. Copie e adapte `.specify/templates/spec-template.md`.
2. Obtenha aprovação humana da intenção.
3. Para `standard`, produza e aprove `plan.md`, depois `tasks.md` e `checklists/requirements.md`.
4. Implemente as tarefas em ordem, marcando somente trabalho verificado.
5. Execute `pnpm sdd:check` e os checks dos workspaces afetados.

