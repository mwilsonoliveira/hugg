# Plano: tornar o seletor de localização resiliente

Spec: `specs/004-fix-location-map/spec.md`  
Data: 2026-08-29

## Resumo técnico

Substituir o marcador avançado pelo marcador clássico suportado pela integração atual, removendo a necessidade de `mapId` e o caminho de inicialização que dispara a exceção observada. Isolar o carregamento do Google Maps em um componente com estado explícito de falha, completar o tratamento dos códigos da API de geolocalização e documentar a configuração externa exigida pela chave pública.

## Contexto técnico

- Workspace afetado: `apps/web`.
- Stack e dependências existentes: Next.js 14, React 18 e `@vis.gl/react-google-maps` 1.8.3.
- Persistência: nenhuma alteração.
- Contratos públicos: nenhuma alteração em HTTP, schemas ou dados; somente comportamento da interface cliente.
- Restrições: preservar os demais campos do formulário quando o mapa falhar; não registrar nem versionar a chave.

## Checagem da constituição

- I e VII: a implementação seguirá esta spec e terá testes da lógica de estados, type-check, build e smoke reproduzível do navegador.
- II e III: os tipos permanecem locais ao componente porque não representam contrato compartilhado; somente `apps/web` será alterado.
- IV: coordenadas continuam obtidas apenas após ação explícita e a chave pública não será registrada; a documentação explicará restrições de origem/API.
- VI: geolocalização, carregamento e falhas terão estados explícitos, mensagens recuperáveis e possibilidade de nova tentativa.
- Não há exceções à constituição.

## Decisões e fluxo de dados

1. `LocationPicker` mantém a ação explícita de geolocalização e traduz `PERMISSION_DENIED`, `POSITION_UNAVAILABLE` e `TIMEOUT` em mensagens distintas, sempre encerrando o loading.
2. O mapa usa `Marker`, que funciona com o mapa padrão e não exige Map ID. A seleção por clique e o ajuste por arraste continuam atualizando `onLocationChange`.
3. Um wrapper de carregamento mantém estado local (`loading`, `ready` ou `error`) por meio de `APIProvider.onLoad/onError`. Em falha de script, mostra fallback dentro da área do mapa sem desmontar ou bloquear o restante do formulário.
4. A ausência de chave mantém o fallback de configuração. Falhas de autenticação que o Google reporte após o script carregar continuam sendo diagnosticadas pelo código exibido no console; a documentação lista os requisitos e os erros mais comuns.
5. A variável será adicionada a `apps/web/.env.example`, sem valor real, junto da orientação sobre reinício do servidor e configuração no Google Cloud.

## Contratos e modelo de dados

N/A. Não há alterações de API, schema, tipos compartilhados, migrations ou compatibilidade de dados.

## Estratégia de verificação

- Extrair funções puras para mensagens de geolocalização e testá-las com `node:test`, cobrindo sucesso/estado inicial e os três códigos de falha.
- Testar a transição/fallback de carregamento do mapa por lógica pura, sem simular o SDK externo.
- Adicionar ao workspace web um script de teste com `node --import tsx --test`, usando `tsx` como dependência de desenvolvimento já adotada no monorepo.
- Executar `pnpm --filter @hugg/web test`, `pnpm --filter @hugg/web type-check`, `pnpm --filter @hugg/web build` e `pnpm sdd:check`.
- Smoke manual: chave ausente, geolocalização permitida/negada e chave válida com origem local autorizada; confirmar ausência de exceção ao criar/arrastar o marcador.

## Rastreabilidade

| Requisito | Decisão técnica | Verificação |
|---|---|---|
| FR-001 | Atualização de coordenadas e pan após callback de geolocalização | teste de lógica + smoke permitido |
| FR-002 | `Marker` sem `mapId` | type-check, build e smoke de clique/arraste |
| FR-003 | mensagens por código e fallback do provider | testes de lógica + smoke de falha |
| FR-004 | fallback restrito à área do mapa | inspeção do componente + smoke do formulário |
| NFR-001 | variável pública sem valor e documentação de restrições | revisão de `.env.example` e Git |
| NFR-002 | loading finalizado, mensagens e controles existentes preservados | testes, type-check e smoke por teclado |
| NFR-003 | alteração somente no web, sem contratos/persistência | diff e `pnpm sdd:check` |

## Sequência de implementação

1. Adicionar testes das funções de estado e erro.
2. Implementar tratamento completo da geolocalização e fallback de carregamento.
3. Trocar o marcador avançado pelo marcador sem Map ID.
4. Atualizar `.env.example` e documentação operacional pertinente.
5. Executar testes, type-check, build, smoke possível no ambiente e `pnpm sdd:check`.

## Riscos, migração e rollback

- Risco: `Marker` é uma API legada do Google e poderá exigir migração futura.
- Mitigação: ele elimina a exigência atual de Map ID e mantém o contrato visual necessário; uma futura adoção de Advanced Markers deve provisionar e documentar Map ID real.
- Risco: erros de autorização do Google dependem do painel externo e podem ocorrer depois do carregamento do script.
- Mitigação: documentação acionável, fallback para falha detectável pelo loader e preservação do formulário/geolocalização.
- Migração: nenhuma.
- Rollback: restaurar `AdvancedMarker` e a configuração de `mapId`; não há dados a reverter.

## Aprovação

- Responsável: mantenedor do Hugg
- Data: 2026-08-29
- Decisão: aprovada
