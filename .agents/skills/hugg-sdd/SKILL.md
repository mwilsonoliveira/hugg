---
name: hugg-sdd
description: Estruturar, revisar e executar mudanças do Hugg com Spec-Driven Development. Use para novas features, correções comportamentais, contratos, dados, segurança, arquitetura ou manutenção de artefatos em specs/. Não use para apenas explicar o código sem propor mudança.
---

# SDD no Hugg

Use a especificação como fonte de intenção e o código como evidência do estado atual.

## Antes de alterar código

1. Leia `AGENTS.md`, `.specify/memory/constitution.md` e o `AGENTS.md` do escopo afetado.
2. Leia somente os contextos de `docs/context/` pertinentes e confirme suas afirmações no código.
3. Classifique a mudança:
   - `standard` para comportamento, API, dados, segurança, arquitetura, dependências ou múltiplos workspaces;
   - `fast` apenas para correções/documentação triviais sem alteração de contrato.
4. Localize a feature em `specs/NNN-kebab-case/` ou crie a próxima numeração disponível a partir dos templates em `.specify/templates/`.

## Gates do workflow

- Especificação: esclareça somente decisões de alto impacto; escreva FR/NFR/SC verificáveis e aguarde aprovação humana antes do plano.
- Plano: derive decisões técnicas da spec e do repositório, inclua rastreabilidade e aguarde aprovação antes das tarefas.
- Tarefas: decomponha trabalho verificável, referencie todos os FR/NFR e ordene testes antes do código quando aplicável.
- Implementação: execute apenas tarefas aprovadas, marque `[x]` após a verificação correspondente e não amplie escopo silenciosamente.
- Validação: execute `pnpm sdd:check`, testes e checks dos workspaces afetados; compare o resultado com spec, plano e checklist.

No track `fast`, use uma spec reduzida e um único gate humano antes da implementação. Promova para `standard` se surgir impacto de contrato, dados, segurança ou arquitetura.

## Regras de manutenção

- Use `draft`, `approved`, `planned`, `ready`, `implementing`, `done` ou `superseded` no frontmatter.
- Atualize `updated` sempre que a intenção mudar; não reescreva uma spec `done` para descrever outra mudança.
- Se o código divergir da spec, reporte a divergência e obtenha uma decisão. Não ajuste ambos apenas para fazer o validador passar.
- Mantenha detalhes estáveis nos contextos e detalhes da mudança no diretório da feature, sem duplicação.

