---
id: "006"
title: "Modal contextual de autenticação com Google e e-mail"
status: implementing
track: standard
created: 2026-09-08
updated: 2026-09-09
---

# Spec: modal contextual de autenticação

## Objetivo

Solicitar acesso em um modal sobre a navegação pública, com mensagem contextual e autenticação funcional por e-mail ou Google.

## Requisitos funcionais

- FR-001: Ações protegidas sem sessão abrem modal contextual com título por intenção, subtítulo “Ajude milhares de pets a encontrarem um lar” e marca ou foto quando houver.
- FR-002: Oferecer Google, cadastro por e-mail e login; os formulários de e-mail permanecem no modal.
- FR-003: Criar conta/entrar com Google; se o e-mail já tem conta com senha, exigir confirmação dessa senha antes de vincular.
- FR-004: Após autenticação, retomar a ação; fechar mantém visitante na página sem executar a ação.
- FR-005: Preservar /login para acessos diretos, com os mesmos métodos e destino seguro.

## Requisitos não funcionais

- NFR-001: Verificar autenticação/autoria no servidor, validar OAuth e impedir vinculação sem prova, replay e redirecionamento externo.
- NFR-002: Modal responsivo, teclado, Escape, fechamento explícito, foco restaurado e estados de carregamento/erro/recuperação.

## Critérios de sucesso

- SC-001: Testes cobrem e-mail, Google, vinculação, cancelamento e retorno desktop/mobile; checks dos workspaces e sdd:check passam. Smoke OAuth real em Preview exige credenciais externas configuradas.

## Fora de escopo

Favoritos persistentes, recuperação de senha, termos legais novos, páginas de conta, alteração do mobile Expo e publicação de infraestrutura.

## Dados e compatibilidade

Preservar usuários e sessões JWT. Armazenar subject Google, nome/e-mail necessários à conta; não persistir tokens Google. Contextos OAuth criptografados expiram em dez minutos. Identidade nunca entra em respostas públicas de pets. Não alterar retenção das contas existentes.

## Aprovação

- Responsável: mantenedor do Hugg
- Data: 2026-09-08
- Decisão: aprovada na conversa; plano aprovado pelo pedido de implementação.
