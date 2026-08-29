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

