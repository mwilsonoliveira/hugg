# Contexto da aplicação web

Aplica-se a `apps/web`.

- A aplicação usa Next.js 14 App Router, React 18 e Tailwind CSS.
- As páginas do site estão em `src/app/(site)`: home e detalhes são públicos; cadastro e edição exigem `requirePageUser` no servidor. O cookie HTTP-only `token` é validado por assinatura, expiração e existência do usuário. O middleware em `src/middleware.ts` cuida da manutenção, não da autorização.
- Prefira Server Components; use `"use client"` apenas quando houver estado, efeitos ou APIs do navegador.
- Ações de mutação do Next ficam em `src/app/actions`; acesso HTTP compartilhado fica em `src/lib/api.ts`.
- Tipos e validações de domínio devem vir de `@hugg/schemas` ou `@hugg/types`, sem cópias locais divergentes.
- Preserve responsividade, navegação por teclado, estados de loading/erro/vazio e confirmação de alterações não salvas.
- Não considere decodificar o JWT no frontend uma validação de autenticidade; autorização pertence à API.
- Verifique mudanças com `pnpm --filter @hugg/web type-check` e build/testes proporcionais ao risco.

