# Contexto dos packages compartilhados

Aplica-se a `packages/*`.

- `schemas` contém contratos Zod de entrada e resposta compartilhados.
- `types` contém tipos globais; evite duplicar unions já inferíveis dos schemas.
- `utils` deve permanecer independente de browser, Node e React quando possível.
- `ui` contém componentes React compartilháveis; não mova componentes específicos da web para cá sem uso real em mais de um consumidor.
- `config` centraliza configurações comuns de TypeScript, ESLint e Tailwind.
- Uma alteração em package compartilhado deve identificar e validar todos os consumidores afetados.
- Mudanças incompatíveis em schema, tipo ou export público exigem track `standard` e estratégia de migração no plano.

