# Contexto da API

Aplica-se a `apps/api`.

- A API é Fastify 4 com TypeScript, Prisma 7 e PostgreSQL. O entrypoint de rotas é `src/app.ts`.
- Valide entrada com os schemas compartilhados de `@hugg/schemas`; não replique regras Zod nas rotas.
- Alterações públicas de request/response são mudanças de contrato e exigem track `standard`.
- Mudanças no banco devem passar por `prisma/schema.prisma` e por uma migration nova. Não reescreva migrations já aplicadas.
- A autenticação real usa bcrypt + JWT em `src/routes/auth.ts`; Better Auth aparece na documentação/dependências, mas não está integrado.
- O cadastro de pet ainda escolhe o primeiro usuário do banco, sem usar o usuário autenticado. Preserve isso somente quando a spec não estiver corrigindo o fluxo.
- A busca por proximidade calcula distâncias em memória; PostGIS ainda não é consultado pela aplicação.
- Nunca use o segredo JWT padrão de desenvolvimento como configuração aceitável de produção.
- Verifique mudanças com `pnpm --filter @hugg/api type-check` e, quando aplicável, testes de rota/contrato.

