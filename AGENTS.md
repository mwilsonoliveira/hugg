# Hugg — contexto para agentes

Este repositório usa Spec-Driven Development (SDD). A especificação aprovada é a fonte de intenção; o código é a evidência do comportamento atualmente implementado.

## Ordem de leitura

1. Leia `.specify/memory/constitution.md`.
2. Leia somente os documentos de `docs/context/` relacionados à mudança.
3. Leia o `AGENTS.md` mais próximo dos arquivos que serão alterados.
4. Se houver uma feature ativa, leia `spec.md`, `plan.md`, `tasks.md` e seus checklists em `specs/NNN-feature/`.
5. Confirme no código o estado atual antes de planejar ou implementar.

Não trate `README.md`, `SETUP.md` ou planos futuros como prova de que uma capacidade já existe. As divergências conhecidas estão registradas em `docs/context/architecture.md`.

## Escolha do track

- Use `standard` para features, mudanças de comportamento, API, schema de dados, autenticação, segurança, arquitetura, dependências ou mais de um workspace.
- Use `fast` apenas para documentação e correções triviais que não mudem contratos nem regras de negócio.
- Se uma mudança `fast` crescer durante a investigação, promova-a para `standard` antes de implementar.

## Gates

- `standard`: `spec.md` aprovado → `plan.md` aprovado → `tasks.md` pronto → implementação → validação.
- `fast`: spec curta aprovada → implementação → validação.
- Não invente requisitos para preencher lacunas de produto. Registre a dúvida e peça decisão quando ela alterar escopo, segurança ou experiência.
- Mantenha IDs `FR-###`, `NFR-###`, `SC-###` e referências nas tarefas.
- Ao concluir, execute `pnpm sdd:check` e as verificações relevantes do workspace.

## Mapa de contexto

- Produto e atores: `docs/context/product.md`
- Arquitetura e estado real: `docs/context/architecture.md`
- Autenticação: `docs/context/domains/authentication.md`
- Cadastro e publicação de pets: `docs/context/domains/pets.md`
- Busca e localização: `docs/context/domains/discovery-location.md`
- Adoções: `docs/context/domains/adoptions.md`
- Templates: `.specify/templates/`
- Workflow Codex: `.agents/skills/hugg-sdd/SKILL.md`

