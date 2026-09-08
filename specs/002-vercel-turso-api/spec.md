---
id: "002"
title: "Migrar API para Vercel e banco para Turso"
status: implementing
track: standard
created: 2026-08-29
updated: 2026-08-29
---

# Spec: migrar API para Vercel e banco para Turso

## Contexto e problema

A web e a API são implantadas separadamente na Vercel e Railway, enquanto a persistência usa PostgreSQL. Essa divisão exige URLs, CORS e dois ciclos de deploy. Fotos são armazenadas em Base64 no banco e podem exceder o limite de payload das Vercel Functions.

## Objetivo

Executar web e API no mesmo deployment Next/Vercel, migrar toda a persistência para Turso/libSQL e armazenar fotos no Vercel Blob, preservando os contratos HTTP existentes e os dados de produção.

## Fora de escopo

- Implementar o fluxo funcional de adoções.
- Introduzir Redis, filas, chat ou notificações.
- Manter a URL Railway como contrato público após o cutover.

## Requisitos funcionais

- FR-001: Quando a aplicação Next subir, o sistema deve expor os endpoints atuais em `/api/*` e o health check em `/health` no mesmo domínio.
- FR-002: O sistema deve persistir usuários, pets, pesquisas e adoções no Turso por Prisma/libSQL, preservando os formatos públicos.
- FR-003: Quando um usuário autenticado criar um pet, o sistema deve associá-lo ao usuário real; somente o autor deve poder editá-lo.
- FR-004: Quando uma foto válida for escolhida, o sistema deve enviá-la diretamente ao Vercel Blob e persistir somente sua URL.
- FR-005: O processo de cutover deve copiar todos os dados Railway para um Turso vazio, transformar fotos Base64 e verificar integridade antes de liberar tráfego.
- FR-006: Enquanto `MAINTENANCE_MODE=true`, o sistema deve mostrar manutenção e deixar disponível somente `/health`.

## Requisitos não funcionais

- NFR-001: Segredos de Turso, Blob e JWT não devem ser expostos no cliente, no Git ou em logs.
- NFR-002: Migrations Turso devem ser versionadas, idempotentes e aplicadas fora do runtime de requisição.
- NFR-003: Produção e preview devem usar bancos e Blob Stores separados; desenvolvimento deve usar SQLite local.
- NFR-004: A migração deve permitir rollback antes da abertura do Turso e conservar o Railway recuperável por sete dias.

## Critérios de sucesso

- SC-001: Build, type-check, testes e `pnpm sdd:check` terminam com sucesso.
- SC-002: Contagens, IDs, relações e hashes canônicos coincidem entre PostgreSQL e Turso após transformação.
- SC-003: Login, catálogo, busca, proximidade, criação, edição autorizada e fotos funcionam no preview e na produção.

## Casos-limite e falhas

- Migração encontra Turso não vazio → aborta sem copiar.
- Registro Base64 inválido → aborta e relata somente pet/índice, sem conteúdo.
- Usuário não autenticado ou não proprietário → `401` ou `403`.
- Upload fora de JPEG/PNG/WebP, acima de 5 MB ou além de cinco fotos → rejeitado.

## Aprovação

- Responsável: mantenedor do Hugg
- Data: 2026-08-29
- Decisão: aprovada

