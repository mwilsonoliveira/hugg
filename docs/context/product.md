# Contexto do produto

## Propósito

O Hugg busca conectar animais desabrigados a pessoas capazes de oferecer um novo lar. O produto reúne publicação, descoberta e acompanhamento de animais em uma experiência web, com uma aplicação mobile planejada.

## Atores

- Visitante: acessa o login, mas ainda não navega anonimamente pelo catálogo.
- Usuário autenticado: consulta pets, busca por nome ou raça, permite localização e publica/edita animais.
- Publicador ou responsável: pessoa associada ao cadastro do pet; a autorização desse vínculo ainda não está implementada corretamente.
- Adotante: papel representado no modelo `Adoption`, ainda sem jornada de API ou interface.
- Abrigo/resgatador: conceito presente na direção do produto, mas ainda não modelado como entidade ou papel próprio.

## Capacidades observadas

- Registro, login, sessão web por cookie e logout.
- Listagem paginada de pets, busca por nome/raça e filtro por tempo de espera.
- Exibição de pets próximos quando o usuário concede localização.
- Cadastro, detalhe e edição de pets na web.
- Histórico agregado de termos pesquisados.
- Modelo de dados inicial para solicitações de adoção.

## Resultados desejados

- Tornar animais disponíveis fáceis de descobrir e compartilhar.
- Dar prioridade e visibilidade a animais esperando há mais tempo ou próximos do usuário.
- Manter dados de contato e localização expostos somente conforme regras explícitas.
- Evoluir web e mobile com contratos comuns, sem presumir paridade automática.

## Fora da realidade atual

Chat em tempo real, notificações, filas BullMQ, uploads gerenciados em Cloudinary/S3, fluxo completo de adoção, papéis de abrigo e consultas PostGIS não estão implementados. Devem surgir apenas por meio de novas specs.

