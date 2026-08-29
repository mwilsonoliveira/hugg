# Tarefas: nome da mudança

Spec: `specs/NNN-feature/spec.md`  
Plano: `specs/NNN-feature/plan.md`

## Formato

`- [ ] TNNN [P?] [US-NNN] [FR-NNN,NFR-NNN] Descrição com caminho e resultado verificável`

- `[P]` indica execução paralela segura em arquivos diferentes.
- Cada FR/NFR da spec deve aparecer em pelo menos uma tarefa.
- Tarefas de teste devem anteceder a implementação correspondente quando o plano exigir TDD.

## Fase 1 — Preparação

- [ ] T001 [FR-001] [caminho] Preparar a fundação necessária.

## Fase 2 — História US-001

- [ ] T002 [US-001] [FR-001,NFR-001] [caminho de teste] Criar a verificação do comportamento.
- [ ] T003 [US-001] [FR-001] [caminho de código] Implementar o comportamento.

## Fase 3 — Integração e qualidade

- [ ] T004 [NFR-001] Executar as verificações definidas no plano.
- [ ] T005 Atualizar documentação e executar `pnpm sdd:check`.

## Dependências

Registre bloqueios entre fases ou tarefas. Tarefas sem dependência podem ser marcadas `[P]`.

