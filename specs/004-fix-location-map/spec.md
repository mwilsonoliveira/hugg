---
id: "004"
title: "Tornar o seletor de localização resiliente"
status: done
track: standard
created: 2026-08-29
updated: 2026-08-29
---

# Spec: tornar o seletor de localização resiliente

## Contexto e problema

No cadastro de pets, acionar **Usar minha localização** pode atualizar as coordenadas e, ao mesmo tempo, provocar uma exceção interna (`Cannot read properties of undefined (reading 'getRootNode')`). Quando uma chave do Google Maps está presente, mas a integração externa não consegue autenticar ou carregar corretamente, a interface exibe somente a mensagem genérica do Google e não oferece orientação recuperável ao usuário.

## Objetivo

Permitir que o usuário obtenha e ajuste a localização do pet sem exceções na interface, com estados de falha claros tanto para geolocalização quanto para carregamento/autenticação do mapa.

## Fora de escopo

- Alterar a precisão, retenção ou persistência das coordenadas.
- Geocodificar endereços ou adicionar busca de lugares.
- Provisionar automaticamente chave, faturamento, APIs ou restrições no Google Cloud.
- Alterar os endpoints ou contratos de pets.

## Histórias e cenários

### US-001 — Informar a localização do pet

Como pessoa que cadastra um pet, quero usar minha posição atual e ajustá-la no mapa, para informar onde o animal está sem interromper o cadastro.

Critérios de aceitação:

1. Dado um navegador com geolocalização permitida e mapa disponível, quando o usuário aciona **Usar minha localização**, então as coordenadas e o marcador são atualizados e o mapa centraliza a posição sem exceção.
2. Dado que a geolocalização não está disponível, foi negada ou excedeu o tempo de espera, quando a solicitação termina, então a interface encerra o carregamento e apresenta uma mensagem adequada.
3. Dado que a chave do mapa está ausente ou que o Google Maps falha ao carregar/autenticar, quando o seletor é exibido, então o cadastro continua utilizável e a interface apresenta orientação recuperável sem lançar erro não tratado.

## Requisitos funcionais

- FR-001: O botão **Usar minha localização** deve atualizar as coordenadas e centralizar o mapa quando a geolocalização for obtida.
- FR-002: O seletor deve permitir posicionar e arrastar o marcador sem depender de um Map ID adicional à chave da Maps JavaScript API.
- FR-003: O seletor deve distinguir ausência de configuração, falha do mapa e falha de geolocalização por mensagens acionáveis.
- FR-004: Uma falha de mapa não deve impedir o preenchimento dos demais campos nem a obtenção das coordenadas por geolocalização.

## Requisitos não funcionais

- NFR-001: A chave pública deve continuar fornecida somente por variável de ambiente e nunca ser registrada em logs ou versionada.
- NFR-002: O fluxo deve preservar estados de loading, recuperação e uso por teclado, sem exceções não tratadas no navegador.
- NFR-003: A correção deve permanecer restrita ao workspace web e não alterar contratos públicos ou persistência.

## Critérios de sucesso

- SC-001: O fluxo de localização possui verificações automatizadas para sucesso, negação/timeout e falha de carregamento do mapa.
- SC-002: Type-check e build do workspace web, testes relevantes e `pnpm sdd:check` passam.
- SC-003: A configuração documentada identifica os requisitos externos necessários para uma chave válida do Google Maps em desenvolvimento.

## Entidades e contratos afetados

- Interface web do cadastro de pets e sua integração cliente com geolocalização e Google Maps.
- Nenhuma alteração em entidades persistidas ou contratos HTTP.

## Casos-limite e falhas

- Navegador sem API de geolocalização -> mensagem de indisponibilidade, sem iniciar loading permanente.
- Permissão negada -> mensagem para permitir localização no navegador.
- Timeout ou posição indisponível -> mensagem específica e possibilidade de tentar novamente.
- Chave ausente -> orientação de configuração sem tentar carregar o mapa.
- Script ou autenticação do Google Maps falha -> fallback local, sem exceção não tratada e sem bloquear o formulário.

## Premissas e dependências

- A localização só é solicitada após ação explícita do usuário nesse seletor.
- Exibir o mapa depende de uma chave com Maps JavaScript API habilitada, faturamento ativo quando exigido e restrição HTTP que aceite a origem usada.
- Uma chave `NEXT_PUBLIC_*` é necessariamente entregue ao navegador; sua proteção ocorre por restrições de API e origem no Google Cloud, não por sigilo no bundle.

## Aprovação

- Responsável: mantenedor do Hugg
- Data: 2026-08-29
- Decisão: aprovada
