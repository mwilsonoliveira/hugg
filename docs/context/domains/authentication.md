# Domínio: autenticação

## Comportamento atual

- Registro exige nome, e-mail válido e senha com pelo menos oito caracteres; telefone é opcional.
- E-mail duplicado retorna conflito; senha é armazenada com bcrypt.
- Login devolve JWT e um resumo do usuário.
- A web grava o JWT em cookie HTTP-only por sete dias. Home `/` e detalhes `/pets/[id]` são públicos; cadastro e edição exigem sessão no servidor.
- `/login?next=...` retoma uma página interna permitida após login; destino inválido usa `/`. A ação de registro segue a mesma regra. Logout retorna à home.
- Visitantes veem Entrar no desktop/mobile. Sessão inválida permite navegação pública e exige login nas páginas protegidas.
- `GET /api/auth/me` valida assinatura e existência do usuário.

## Regras e riscos

- O fallback `hugg-jwt-secret-dev` só é aceitável no desenvolvimento local.
- A sessão do servidor verifica assinatura, expiração e existência do usuário no banco.
- Route Handlers aceitam cookie HTTP-only ou Bearer; mutações exigem autenticação.
- Somente o usuário registrado em `createdById` pode editar um pet; os demais recebem `403`.

Qualquer troca de mecanismo de sessão, exposição de perfil, recuperação de senha, papéis ou autorização exige spec `standard` e estratégia de compatibilidade.
