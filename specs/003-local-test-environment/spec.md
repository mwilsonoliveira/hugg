---
id: "003"
title: "Preparar ambiente local para cadastro de pets"
status: done
track: standard
created: 2026-08-29
updated: 2026-08-29
---

# Spec: preparar ambiente local para cadastro de pets

## Contexto e problema

O seed local possui credenciais implícitas, mas elas não estão visíveis no login. O cadastro também depende de Vercel Blob mesmo em desenvolvimento, impedindo testes sem uma conta externa.

## Objetivo

Permitir que um desenvolvedor prepare o SQLite, acesse a aplicação com uma conta previsível e cadastre pets com fotos locais sem expor esse comportamento em produção.

## Fora de escopo

- Sincronizar arquivos locais com Vercel Blob.
- Limpar automaticamente imagens locais órfãs.
- Criar credenciais padrão em Turso remoto.

## Requisitos funcionais

- FR-001: O seed local deve criar ou restaurar `admin@hugg.com` com a senha documentada de teste sem duplicar usuários.
- FR-002: A tela de login deve exibir e preencher as credenciais de teste somente em desenvolvimento.
- FR-003: Em desenvolvimento, usuários autenticados devem enviar JPEG, PNG ou WebP de até 5 MB para armazenamento local e receber uma URL utilizável pelo cadastro.
- FR-004: Em Preview e Production, o upload deve continuar usando exclusivamente Vercel Blob.

## Requisitos não funcionais

- NFR-001: O seed padrão deve falhar contra banco remoto sem autorização e credenciais explícitas.
- NFR-002: Arquivos locais não devem ser versionados e nomes solicitados não devem permitir path traversal.
- NFR-003: A interface deve informar estados de upload e falhas de validação.

## Critérios de sucesso

- SC-001: Um ambiente novo executa migrate, seed, login e cadastro de pet sem credenciais externas.
- SC-002: Build, tipos, testes e `pnpm sdd:check` passam, e o build de produção não contém a dica local.

## Casos-limite e falhas

- Seed remoto sem opt-in ou senha explícita → aborta antes de escrever.
- Upload sem sessão, inválido ou acima de 5 MB → retorna 401 ou 400.
- Nome de arquivo fora do formato gerado → retorna 404.

## Aprovação

- Responsável: mantenedor do Hugg
- Data: 2026-08-29
- Decisão: aprovada
