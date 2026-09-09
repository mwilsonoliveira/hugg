---
id: "001"
title: "Adotar Spec-Driven Development"
status: done
track: standard
created: 2026-08-29
updated: 2026-08-29
---

# Spec: adotar Spec-Driven Development

## Contexto e problema

O Hugg evoluiu como um projeto brownfield sem uma fonte versionada que separe intenção de produto, decisões técnicas e tarefas. A documentação existente mistura capacidades implementadas com escolhas futuras, o que aumenta a ambiguidade para pessoas e agentes de IA.

## Objetivo

Estabelecer um workflow SDD enxuto, compatível com o modelo do Spec Kit, contextualizado para o monorepo e verificável localmente.

## Fora de escopo

- Alterar comportamento das aplicações, APIs ou banco.
- Instalar a CLI oficial do Spec Kit.
- Bloquear pull requests por GitHub Actions nesta etapa.
- Criar retrospectivamente testes das funcionalidades do produto.

## Histórias e cenários

### US-001 — Preparar uma mudança com contexto confiável

Como pessoa ou agente que contribui no Hugg, quero encontrar governança, estado atual e templates versionados, para transformar uma intenção em implementação rastreável sem depender do histórico de conversa.

Critérios de aceitação:

1. Dada uma mudança de produto, quando o contribuidor inicia o trabalho, então ele encontra constituição, contexto relevante e critérios objetivos para escolher o track.
2. Dada uma divergência entre documentação e código, quando o contexto é consultado, então capacidade atual e direção futura aparecem separadas.

### US-002 — Validar a integridade dos artefatos

Como mantenedor, quero validar specs por comando local, para detectar estrutura, estado ou rastreabilidade incompletos antes da implementação ou revisão.

Critérios de aceitação:

1. Dada uma feature válida, quando o validador roda, então termina com sucesso.
2. Dada uma feature inconsistente, quando o validador roda, então informa caminho e regra violada e termina com erro.

## Requisitos funcionais

- FR-001: O repositório deve fornecer constituição, contexto de produto, arquitetura e domínios observados no código atual.
- FR-002: O repositório deve fornecer templates para spec, plano, tarefas e checklist com requisitos identificáveis.
- FR-003: Quando o Codex atuar em uma mudança do Hugg, o repositório deve disponibilizar uma skill local que aplique o workflow sem duplicar a fonte de verdade.
- FR-004: Quando `pnpm sdd:check` for executado, o sistema deve validar fundação, diretórios, metadados, artefatos por estado, IDs e rastreabilidade.
- FR-005: O repositório deve registrar esta implantação como a primeira feature SDD e documentar como iniciar as próximas.

## Requisitos não funcionais

- NFR-001: O contexto deve ser agnóstico de agente e usar divulgação progressiva por escopo.
- NFR-002: O validador deve executar em Node.js 20 sem dependências externas e estar pronto para uso em CI.
- NFR-003: A implantação não deve alterar contratos ou comportamento de runtime do produto.

## Critérios de sucesso

- SC-001: `pnpm sdd:test` e `pnpm sdd:check` terminam com código zero.
- SC-002: `pnpm type-check` continua terminando com código zero ou evidencia falhas preexistentes sem relação com SDD.
- SC-003: Todos os caminhos referenciados por `AGENTS.md`, README, skill e feature bootstrap existem no repositório.

## Entidades e contratos afetados

Somente o contrato de desenvolvimento é ampliado: diretórios SDD, frontmatter das specs e comandos pnpm. Não há mudança de entidade ou API do produto.

## Casos-limite e falhas

- Feature `standard` avançada sem plano, tarefas ou checklist → validação falha.
- Feature `fast` sem impacto de contrato → pode ser concluída somente com spec curta aprovada.
- Feature `done` com checkbox ou aprovação pendente → validação falha.
- Mudança inicialmente trivial ganha impacto de dados/segurança → deve ser promovida para `standard`.

## Premissas e dependências

- A equipe continuará revisando semanticamente as specs; o validador estrutural não substitui revisão humana.
- Português é o idioma do conteúdo, com nomes de arquivos, IDs e termos técnicos estáveis em inglês.

## Aprovação

- Responsável: mantenedor do Hugg
- Data: 2026-08-29
- Decisão: aprovada
