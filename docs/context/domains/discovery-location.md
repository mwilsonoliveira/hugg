# Domínio: descoberta e localização

## Busca e ordenação

- A listagem pesquisa nome e raça sem diferenciar maiúsculas/minúsculas.
- O filtro de espera aceita 7, 30, 90 e `90+` dias.
- A ordenação prioriza a menor data `waitingSince`, isto é, quem espera há mais tempo.
- A paginação inicia em 1, usa limite padrão 6 na API e máximo 50; a web solicita 12.
- Termos com ao menos dois caracteres são normalizados para minúsculas e acumulados em `SearchHistory`.

## Proximidade

- A web pede geolocalização ao navegador e só consulta proximidade após consentimento.
- A API carrega todos os pets com coordenadas, calcula Haversine em memória, filtra por raio e limita o resultado.
- Raio padrão é 50 km; limite padrão é 10 e máximo 20.
- PostGIS está disponível na imagem do banco, mas não é usado nesse fluxo.

Mudanças de precisão, escala, privacidade, retenção de buscas ou estratégia geográfica exigem spec `standard`.

## Mapa no cadastro web

- O seletor usa a Maps JavaScript API por meio de `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`; não exige um Map ID.
- Em desenvolvimento, a variável fica em `apps/web/.env.local` e requer reiniciar o servidor Next após alterações.
- O projeto Google Cloud precisa ter Maps JavaScript API e faturamento habilitados. A chave pública deve ser restringida à API e às origens HTTP autorizadas, incluindo a origem local durante desenvolvimento.
- Falhas do mapa não impedem obter as coordenadas pelo navegador nem preencher os demais campos do cadastro.
