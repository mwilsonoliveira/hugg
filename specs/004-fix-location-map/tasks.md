# Tarefas: tornar o seletor de localização resiliente

Spec: `specs/004-fix-location-map/spec.md`  
Plano: `specs/004-fix-location-map/plan.md`

## Fase 1 — Verificações

- [x] T001 [US-001] [FR-001,FR-003,NFR-002] Criar testes para mensagens de falha da geolocalização e estado de carregamento do mapa.

## Fase 2 — Seletor de localização

- [x] T002 [US-001] [FR-001,FR-003,FR-004,NFR-002] Tratar todos os resultados de geolocalização e o fallback de carregamento em `apps/web/src/components/location-picker.tsx`.
- [x] T003 [US-001] [FR-002,NFR-002,NFR-003] Substituir o marcador avançado pelo marcador sem Map ID preservando clique, arraste e centralização.

## Fase 3 — Configuração e qualidade

- [x] T004 [FR-003,NFR-001] Documentar a variável e os requisitos externos do Google Maps no ambiente web.
- [x] T005 [FR-001,FR-002,FR-003,FR-004,NFR-001,NFR-002,NFR-003] Executar testes, type-check, build, revisão do diff e `pnpm sdd:check`.

## Dependências

- T001 antecede T002 e T003.
- T004 pode ser executada após a implementação estabilizar.
- T005 depende de T001–T004.
