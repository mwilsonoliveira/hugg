# Constituição do Hugg

Versão: 1.0.0  
Ratificada em: 2026-08-29  
Última alteração: 2026-08-29

## I. Intenção especificada, realidade verificada

A especificação aprovada DEVE ser a fonte de verdade para a intenção de uma mudança. O código e os dados DEVEM ser inspecionados como evidência do estado atual. Quando houver conflito, a equipe DEVE decidir se corrige a implementação ou atualiza a especificação antes de continuar; o agente não pode resolver o conflito silenciosamente.

## II. Contratos explícitos e tipados

Todo código de aplicação DEVE manter TypeScript estrito. Entradas, saídas e regras compartilhadas DEVEM usar os schemas de `@hugg/schemas`; contratos públicos não DEVEM ser duplicados de forma divergente em apps. Mudanças incompatíveis em API, schema, tipo ou evento DEVEM declarar migração e consumidores afetados.

## III. Limites do monorepo

Web, mobile e API DEVEM permanecer consumidores dos packages compartilhados, sem dependências diretas entre apps. Código só DEVE ir para `packages` quando possuir uma responsabilidade compartilhável real. Cada plano DEVE indicar os workspaces afetados e respeitar seus arquivos `AGENTS.md` locais.

## IV. Segurança e privacidade por construção

Segredos e credenciais NÃO DEVEM ser enviados ao cliente, commitados ou registrados em logs. Autenticação e autorização DEVEM ser verificadas no servidor; decodificação de JWT no cliente não é prova de autenticidade. Mudanças que tratem identidade, localização, telefone ou outros dados pessoais DEVEM especificar exposição, retenção, autorização e falhas seguras.

## V. Dados evoluem de forma rastreável

Alterações persistentes DEVEM usar migrations Prisma novas, revisáveis e compatíveis com dados existentes. Migrations aplicadas NÃO DEVEM ser reescritas. Mudanças destrutivas, backfills e rollbacks DEVEM estar explícitos no plano e exigir aprovação humana.

## VI. Experiência inclusiva e resiliente

Fluxos de usuário DEVEM considerar acessibilidade, responsividade, estados de loading, vazio, erro e recuperação. Recursos dependentes de localização ou rede DEVEM possuir consentimento e comportamento de fallback explícitos. Regras específicas de web não DEVEM ser assumidas como válidas no mobile.

## VII. Evidência proporcional ao risco

Features e mudanças de contrato, dados, segurança ou arquitetura DEVEM usar o track `standard`, com requisitos verificáveis, plano e tarefas rastreáveis. Mudanças triviais PODEM usar `fast`, desde que não alterem comportamento contratado. Testes DEVEM ser adicionados para comportamento novo ou corrigido; na ausência de infraestrutura de testes, o plano DEVE incluir sua introdução ou justificar uma verificação reproduzível equivalente.

## Governança

- A ordem de autoridade é: constituição → spec aprovada → plano aprovado → tarefas → implementação.
- A aprovação de uma etapa não autoriza ampliar o escopo da etapa seguinte.
- Toda exceção a um princípio DEVE ser registrada no plano com motivo, risco e alternativa rejeitada.
- Alterações nesta constituição exigem revisão humana, incremento de versão e atualização dos templates ou contextos afetados.
- `pnpm sdd:check` é o gate estrutural mínimo; ele complementa, mas não substitui, revisão semântica e testes do produto.

