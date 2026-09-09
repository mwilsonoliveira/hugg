# Plano: modal contextual

## Decisões

- FR-001,FR-002,NFR-002: controlador no layout site, dialog nativo até 480px, identidade Hugg, escolha/cadastro/login/confirmação no mesmo componente reutilizado por /login.
- FR-004,FR-005: preservar retorno seguro; CTAs desktop/mobile interceptam visitantes; autenticação servidor permanece independente. OAuth volta à origem em erros/vínculo e segue destino em sucesso.
- FR-003,NFR-001: google-auth-library, Authorization Code com PKCE/state/nonce e verificação completa do ID token; subject estável e e-mail verificado. Contas existentes exigem senha para vínculo.
- FR-003,NFR-001: User.googleSubject único opcional e passwordHash opcional. Migration nova preserva dados. Ledger AuthAttempt com ID, expiração e contador de tentativas garante consumo único e limite de cinco confirmações por contexto; exclusão dos expirados ao iniciar fluxo. Cookie criptografado HTTP-only/SameSite=Lax/Secure em produção por dez minutos, sem persistir tokens Google.
- Workspaces: web, database e schemas. Entradas novas Zod compartilhadas. APIs REST existentes e JWT de sete dias compatíveis.

## Configuração

GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET e GOOGLE_REDIRECT_URI por ambiente, callback /api/auth/google/callback autorizado. Sem configuração, Google desabilitado e e-mail funcional. JWT_SECRET preservado. Callback e início usam origem configurada validada, nunca Host arbitrário para compor destinos externos.

## Verificação e entrega

Testes de segurança/contas/migration em cópia local, testes UI e checks web/database/schemas; smoke real Google em Preview condicionado a configuração externa. Documentar evidências sem atribuir sucesso a testes externos não executados.

## Rollback e constituição

Sem exceções. Migration testada em cópia com relações e hashes; nenhuma migration antiga é reescrita. Desativar Google é rollback operacional, mantendo schema; não voltar a código que exige senha para todo usuário.

## Aprovação

- Responsável: mantenedor do Hugg
- Data: 2026-09-08
- Decisão: aprovada na conversa.
