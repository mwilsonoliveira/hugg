# Domínio: autenticação

## Comportamento atual

- Registro exige nome, e-mail válido e senha com pelo menos oito caracteres; telefone é opcional.
- E-mail duplicado retorna conflito; senha é armazenada com bcrypt.
- Login devolve JWT e um resumo do usuário.
- A web grava o JWT em cookie HTTP-only por sete dias e redireciona rotas protegidas.
- `GET /api/auth/me` valida assinatura e existência do usuário.

## Regras e riscos

- O fallback `hugg-jwt-secret-dev` só é aceitável no desenvolvimento local.
- O middleware web verifica expiração, mas não assinatura; decisões de autorização devem ocorrer na API.
- Ainda não há middleware Fastify reutilizável nem autorização por proprietário nos endpoints de pets.
- Better Auth está listado como dependência/direção, porém não controla o fluxo atual.

Qualquer troca de mecanismo de sessão, exposição de perfil, recuperação de senha, papéis ou autorização exige spec `standard` e estratégia de compatibilidade.

