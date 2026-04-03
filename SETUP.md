# 🏗️ Stack Tecnológica para o Monorepo

---

## 📦 Gerenciamento do Monorepo

| Ferramenta          | Por quê?                                           |
| ------------------- | -------------------------------------------------- |
| **Turborepo**       | Performance, cache inteligente, fácil configuração |
| **pnpm Workspaces** | Gerenciamento de dependências eficiente            |

> 💡 A combinação **Turborepo + pnpm** é atualmente o padrão mais adotado no mercado.

---

## 🌐 Aplicação Web

| Camada        | Tecnologia                | Justificativa                                   |
| ------------- | ------------------------- | ----------------------------------------------- |
| Framework     | **Next.js 14+**           | SSR, SSG, App Router, SEO otimizado             |
| Linguagem     | **TypeScript**            | Tipagem compartilhada com toda a stack          |
| Estilização   | **Tailwind CSS**          | Produtividade e consistência visual             |
| Componentes   | **shadcn/ui**             | Acessível, customizável, sem dependência pesada |
| Estado global | **Zustand**               | Leve e simples                                  |
| Formulários   | **React Hook Form + Zod** | Validação robusta e tipada                      |

---

## 📱 Aplicação Mobile

| Camada        | Tecnologia                | Justificativa                                    |
| ------------- | ------------------------- | ------------------------------------------------ |
| Framework     | **React Native + Expo**   | Compartilha lógica com o Web, grande ecossistema |
| Navegação     | **Expo Router**           | File-based routing, igual ao Next.js             |
| Estilização   | **NativeWind**            | Tailwind no React Native                         |
| Estado global | **Zustand**               | Mesmo estado do Web — código compartilhado!      |
| Formulários   | **React Hook Form + Zod** | Mesma lib do Web                                 |

---

## ⚙️ API / Backend

| Camada            | Tecnologia              | Justificativa                               |
| ----------------- | ----------------------- | ------------------------------------------- |
| Framework         | **Node.js + Fastify**   | Alta performance, baixo overhead            |
| Linguagem         | **TypeScript**          | Consistência com toda a stack               |
| ORM               | **Prisma**              | Tipagem automática, migrations, multi-banco |
| Validação         | **Zod**                 | Schemas compartilhados com Front e Mobile   |
| Autenticação      | **Better Auth**         | Moderno, flexível, open-source              |
| Upload de imagens | **Cloudinary / AWS S3** | Fotos dos pets                              |
| Filas/Jobs        | **BullMQ + Redis**      | Notificações, e-mails assíncronos           |

---

## 🗄️ Banco de Dados

| Tipo                 | Tecnologia                | Uso                                        |
| -------------------- | ------------------------- | ------------------------------------------ |
| **Relacional**       | **PostgreSQL**            | Dados principais (pets, usuários, adoções) |
| **Cache**            | **Redis**                 | Sessões, filas, cache de buscas            |
| **Busca geográfica** | **PostGIS** (extensão PG) | Encontrar pets por localização             |

---

## 📡 Comunicação API

| Abordagem              | Tecnologia                   | Justificativa                 |
| ---------------------- | ---------------------------- | ----------------------------- |
| **REST**               | Fastify Routes               | Para operações CRUD padrão    |
| **Real-time**          | **WebSocket / Socket.io**    | Chat entre tutor e resgatador |
| **Push Notifications** | **Expo Notifications + FCM** | Alertas de pets encontrados   |

---

## 📁 Estrutura do Monorepo

📦 amirador/ (ou o nome escolhido)
├── apps/
│ ├── web/ → Next.js
│ ├── mobile/ → Expo + React Native
│ └── api/ → Fastify + Node.js
├── packages/
│ ├── ui/ → Componentes compartilhados
│ ├── schemas/ → Schemas Zod compartilhados
│ ├── types/ → Tipos TypeScript globais
│ ├── utils/ → Funções utilitárias
│ └── config/ → ESLint, TSConfig, Tailwind base
├── turbo.json
├── pnpm-workspace.yaml
└── package.json

---

## ☁️ Infraestrutura & Deploy

| Serviço | Tecnologia                           |
| ------- | ------------------------------------ |
| Web     | **Vercel**                           |
| API     | **Railway / Render / Fly.io**        |
| Banco   | **Supabase** (PostgreSQL gerenciado) |
| Mobile  | **Expo EAS Build**                   |
| CI/CD   | **GitHub Actions**                   |

---

## 🗺️ Visão Geral da Stack

[Web - Next.js] ──┐
├──► [API - Fastify] ──► [PostgreSQL + Redis]
[Mobile - Expo] ──┘ │
[packages/]
schemas | types | ui
