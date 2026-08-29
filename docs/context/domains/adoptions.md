# Domínio: adoções

## Estado atual

O Prisma e os packages compartilhados representam uma solicitação de adoção vinculando usuário e pet. Ela pode conter mensagem e assumir `PENDING`, `APPROVED` ou `REJECTED`.

## Capacidades ausentes

Não existem rotas, telas, autorização, notificações nem regras de transição para adoções. Também não está definido:

- quem pode solicitar, aprovar ou rejeitar;
- se um pet admite solicitações concorrentes;
- como aprovação altera o status do pet;
- quais contatos ficam visíveis e em qual momento;
- políticas de cancelamento, auditoria e retenção.

Qualquer implementação deve começar por uma spec `standard` que resolva essas decisões; o modelo existente não constitui uma regra de negócio completa.

