# Domínio: pets

## Entidade atual

Um pet possui espécie obrigatória, situação, fotos, tempo de espera e responsável. Nome, raça, idade, descrição, gênero, localização e contatos podem ser opcionais. Status possíveis: `AVAILABLE`, `UNDER_REVIEW` e `ADOPTED`.

## Regras observadas

- Pelo menos uma foto é exigida no cadastro.
- Cães, gatos, aves e coelhos exigem raça ou a opção SRD; `OTHER` não possui catálogo.
- Idade deve ser inteira e não negativa.
- A data de espera é obrigatória e não pode estar no futuro.
- Cadastro, consulta e edição existem; exclusão e transições formais de status não existem.
- A criação associa temporariamente o primeiro usuário disponível, sem autenticação.
- A edição não verifica propriedade do cadastro.

## Superfícies

API e schema compartilhado definem o contrato; a web oferece listagem, detalhe, criação e edição. O mobile ainda não implementa o domínio. Alterações na entidade devem avaliar Prisma, Zod, tipos, seed, API, web e mobile conforme o escopo declarado.

