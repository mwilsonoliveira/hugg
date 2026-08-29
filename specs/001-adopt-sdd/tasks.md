# Tarefas: adotar Spec-Driven Development

Spec: `specs/001-adopt-sdd/spec.md`  
Plano: `specs/001-adopt-sdd/plan.md`

## Fase 1 — Governança e contexto

- [x] T001 [FR-001,NFR-001,NFR-003] Criar `AGENTS.md`, constituição, contextos centrais e instruções locais baseadas no repositório.

## Fase 2 — Artefatos e integração do agente

- [x] T002 [FR-002,NFR-001] Criar templates de spec, plano, tarefas e checklist em `.specify/templates/`.
- [x] T003 [FR-003,NFR-001] Criar a skill `.agents/skills/hugg-sdd/SKILL.md` referenciando as fontes canônicas.

## Fase 3 — Validação automatizada

- [x] T004 [FR-004,NFR-002] Implementar `scripts/sdd-check.mjs` sem dependências externas.
- [x] T005 [FR-004,NFR-002] Criar cenários positivos e negativos em `scripts/sdd-check.test.mjs` e expor comandos pnpm.

## Fase 4 — Bootstrap e documentação

- [x] T006 [FR-005,NFR-003] Registrar `specs/001-adopt-sdd/` e documentar o workflow no README.
- [x] T007 [FR-001,FR-002,FR-003,FR-004,FR-005,NFR-001,NFR-002,NFR-003] Executar `pnpm sdd:test`, `pnpm sdd:check`, validar a skill e os caminhos; registrar separadamente as falhas preexistentes do type-check da API.

## Dependências

T001 precede os artefatos operacionais. T002 e T003 podem evoluir em paralelo. T004 precede T005 e a validação final T007.
