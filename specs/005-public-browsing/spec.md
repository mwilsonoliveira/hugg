---
id: "005"
title: "Navegação pública e login sob demanda"
status: done
track: standard
created: 2026-09-08
updated: 2026-09-08
---

# Spec: navegação pública e login sob demanda

## Contexto e problema

A home e os detalhes exigem sessão, embora as consultas da API já sejam públicas. Visitantes precisam descobrir e compartilhar animais sem criar uma conta.

## Objetivo

Liberar a navegação e solicitar login apenas para ações restritas.

## Fora de escopo

Cobrança, planos pagos, novas páginas de perfil/abrigos/meus pets, fluxo de adoção e mobile Expo.

## Requisitos funcionais

- FR-001: `/` deve ser a home pública com listagem, busca, filtros e proximidade mediante permissão de localização.
- FR-002: `/pets/[id]` deve ser público, incluindo fotos, informações, telefone, localização e compartilhamento.
- FR-003: Cadastro e edição exigem sessão validada no servidor, inclusive via URL direta; somente o autor pode editar.
- FR-004: `/login` deve retomar o destino solicitado após login; sem destino válido, deve ir para `/`. Logout deve retornar à home pública.
- FR-005: Visitantes devem ter a opção Entrar no desktop e mobile; sessões inválidas não devem bloquear navegação pública.

## Requisitos não funcionais

- NFR-001: Autenticação e autoria devem continuar verificadas no servidor; destinos após autenticação devem ser internos e validados.

## Critérios de sucesso

- SC-001: Navegação anônima, retorno após login, proteção de cadastro/edição e navegação desktop/mobile devem passar nas verificações, junto de testes, type-check, build e sdd:check.

## Entidades e contratos afetados

Rotas web e sessão opcional na apresentação. Endpoints, formatos da API, banco e cookies permanecem compatíveis. Telefone e localização do animal são públicos por decisão explícita do mantenedor; não há nova exposição de perfil de usuário nem mudança de retenção.

## Casos-limite e falhas

Sessão ausente, inválida ou expirada permite consultas e exige login nas ações restritas. Destino externo/inválido volta à home. Erro de login mantém destino. Edição por outro usuário continua bloqueada. Modo de manutenção preservado.

## Premissas e dependências

Sem cobrança. A ação de registro existente também aceita destino seguro; não será criada uma nova interface de registro. Sem migração de dados.

## Aprovação

- Responsável: mantenedor do Hugg
- Data: 2026-09-08
- Decisão: aprovada explicitamente na conversa antes do plano; implementação solicitada após aprovação do plano.
