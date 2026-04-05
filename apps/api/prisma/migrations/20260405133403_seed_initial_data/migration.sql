-- Dados iniciais de produção/develop
-- Roda apenas uma vez via prisma migrate deploy
-- Imagens não incluídas (devem ser adicionadas manualmente ou via upload)

-- Usuários iniciais
INSERT INTO "User" (id, name, email, phone, "createdAt", "updatedAt")
VALUES
  ('seed-user-ana', 'Ana Silva', 'ana@hugg.dev', '11999990001', NOW(), NOW()),
  ('seed-user-joao', 'João Souza', 'joao@hugg.dev', '11999990002', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Pets iniciais (sem imagens)
INSERT INTO "Pet" (id, name, species, breed, age, description, "imageUrls", status, situation, "waitingSince", latitude, longitude, "createdById", "createdAt", "updatedAt")
VALUES
  ('seed-pet-bolt',      'Bolt',      'DOG', 'Sem raça definida (SRD)', 0,  'Cachorro dócil e brincalhão, ótimo com crianças.', '{}', 'AVAILABLE',    'SHELTER',   NOW() - INTERVAL '120 days', -23.5505, -46.6333, 'seed-user-ana',  NOW(), NOW()),
  ('seed-pet-mimi',      'Mimi',      'CAT', 'Sem raça definida (SRD)', 1,  'Gatinha curiosa e carinhosa.',                    '{}', 'AVAILABLE',    'FOSTER',    NOW() - INTERVAL '45 days',  -23.561,  -46.656,  'seed-user-ana',  NOW(), NOW()),
  ('seed-pet-thor',      'Thor',      'DOG', 'Sem raça definida (SRD)', 10, 'Cão grande e tranquilo, gosta de passeios.',      '{}', 'UNDER_REVIEW', 'SHELTER',   NOW() - INTERVAL '200 days', -23.548,  -46.638,  'seed-user-joao', NOW(), NOW()),
  ('seed-pet-nina',      'Nina',      'CAT', 'Sem raça definida (SRD)', 0,  'Filhote resgatada da rua, muito saudável.',       '{}', 'AVAILABLE',    'ABANDONED', NOW() - INTERVAL '10 days',  -23.555,  -46.641,  'seed-user-joao', NOW(), NOW()),
  ('seed-pet-mel',       'Mel',       'CAT', 'Sem raça definida (SRD)', 5,  'Muito carinhosa, ideal para apartamento.',        '{}', 'AVAILABLE',    'FOSTER',    NOW() - INTERVAL '60 days',  -23.562,  -46.654,  'seed-user-joao', NOW(), NOW()),
  ('seed-pet-pipoca',    'Pipoca',    'DOG', 'Sem raça definida (SRD)', 6,  'Cachorro tranquilo, se dá bem com crianças.',     '{}', 'AVAILABLE',    'ABANDONED', NOW() - INTERVAL '30 days',  -23.549,  -46.645,  'seed-user-ana',  NOW(), NOW()),
  ('seed-pet-bolota',    'Bolota',    'DOG', 'Sem raça definida (SRD)', 2,  'Animal muito dócil.',                             '{}', 'AVAILABLE',    'SHELTER',   '2020-07-01',                NULL,     NULL,     'seed-user-ana',  NOW(), NOW()),
  ('seed-pet-claudio',   'Claudio',   'DOG', 'Sem raça definida (SRD)', 2,  'Cão muito dócil.',                                '{}', 'AVAILABLE',    'ABANDONED', '2023-04-01',                NULL,     NULL,     'seed-user-ana',  NOW(), NOW()),
  ('seed-pet-bart',      'Bartolomeu','DOG', 'Labrador Retriever',      4,  'Cachorro muito tranquilo.',                       '{}', 'AVAILABLE',    'FOSTER',    '2024-05-12',                NULL,     NULL,     'seed-user-ana',  NOW(), NOW()),
  ('seed-pet-luna',      'Luna',      'DOG', 'Sem raça definida (SRD)', 4,  'Muito querida.',                                  '{}', 'AVAILABLE',    'FOSTER',    '2025-07-01',                NULL,     NULL,     'seed-user-ana',  NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Histórico de pesquisas iniciais
INSERT INTO "SearchHistory" (id, query, count, "lastUsed")
VALUES
  (gen_random_uuid()::text, 'labrador', 42, NOW()),
  (gen_random_uuid()::text, 'golden retriever', 38, NOW()),
  (gen_random_uuid()::text, 'poodle', 31, NOW()),
  (gen_random_uuid()::text, 'gato siamês', 27, NOW()),
  (gen_random_uuid()::text, 'filhote', 25, NOW()),
  (gen_random_uuid()::text, 'cachorro dócil', 20, NOW()),
  (gen_random_uuid()::text, 'gato persa', 18, NOW()),
  (gen_random_uuid()::text, 'beagle', 15, NOW()),
  (gen_random_uuid()::text, 'pastor alemão', 12, NOW()),
  (gen_random_uuid()::text, 'coelho', 10, NOW())
ON CONFLICT (query) DO NOTHING;
