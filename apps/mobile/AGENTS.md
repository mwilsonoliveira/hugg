# Contexto da aplicação mobile

Aplica-se a `apps/mobile`.

- A aplicação usa Expo SDK 54, Expo Router, React Native e NativeWind.
- O estado atual é somente um scaffold com uma tela inicial; não assuma paridade funcional com a web.
- Qualquer fluxo novo deve ter requisitos mobile explícitos na spec. Não replique automaticamente UX web no mobile.
- Reutilize `@hugg/schemas`, `@hugg/types` e `@hugg/utils` quando compatíveis com React Native.
- Considere permissões, conectividade, navegação, acessibilidade e diferenças entre Android/iOS no plano.
- Verifique mudanças com `pnpm --filter @hugg/mobile type-check` e as validações Expo relevantes.

