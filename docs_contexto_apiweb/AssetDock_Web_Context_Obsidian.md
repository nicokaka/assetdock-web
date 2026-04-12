# AssetDock Web — Contexto Completo para Obsidian

## 1. Visão geral

O **AssetDock Web** é o frontend do produto AssetDock. Ele funciona como a camada visual do backend `assetdock-api`, oferecendo uma interface autenticada para operações de inventário de ativos, ciclo de vida de usuários, atribuições de ativos, auditoria operacional e importação CSV.

A proposta do projeto não é ser uma landing page ou um admin panel genérico. A direção consolidada do repositório é a de um produto **B2B/admin sério**, com visual sóbrio, foco em clareza operacional, densidade útil de dados e sem “efeitos” ou escopo artificial.

O projeto já está tratado internamente como **MVP web concluído**, com o trabalho principal consolidado em `main`.

---

## 2. Papel do repositório dentro do ecossistema AssetDock

O `assetdock-web` **não é** o projeto completo do produto. Ele é o frontend, separado do backend.

### Separação de responsabilidades
- `assetdock-web`
  - interface React/Vite
  - navegação
  - formulários
  - consumo da API
  - UX da área autenticada
  - sessão web no browser
- `assetdock-api`
  - autenticação e autorização
  - persistência
  - multi-tenancy
  - regras de negócio
  - auditoria
  - endpoints REST
  - sessão web por cookie e proteção CSRF

Essa separação é importante porque o projeto foi intencionalmente construído em dois repositórios distintos.

---

## 3. Estado atual do projeto

### Status
O frontend está em um estado de **MVP web funcional, integrado e consolidado em `main`**.

### O que já existe hoje
- autenticação web real por cookie
- proteção de rotas baseada em sessão
- assets
  - listagem
  - detalhe
  - criação
  - edição
  - lifecycle actions
- assignments
- users
  - listagem
  - detalhe
  - criação
  - lifecycle básico (roles/status)
- audit logs
- imports CSV
- smoke E2E com Playwright
- demo script
- passe visual consolidado

### O que ainda não é foco do MVP
- redesign avançado
- tema dark/light
- toasts sofisticados
- animações chamativas
- testes extensos além do smoke E2E
- novo escopo funcional grande

---

## 4. Stack técnica

### Base
- **React 19**
- **TypeScript 5.9**
- **Vite 8**

### UI / estado / forms
- **Tailwind CSS 4**
- **React Router 7**
- **TanStack Query 5**
- **React Hook Form**
- **Zod**
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `lucide-react`

### Testes
- **Playwright** para smoke E2E

### Scripts principais
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run e2e`
- `npm run e2e:headed`

---

## 5. Arquitetura do frontend

### Organização geral
O app usa roteamento no browser com uma separação clara entre:
- shell público
- login
- área autenticada sob `/app`

### Estrutura de alto nível
A árvore principal do frontend gira em torno de:
- `src/components/layout`
- `src/components/ui`
- `src/features/auth`
- `src/features/assets`
- `src/features/assignments`
- `src/features/users`
- `src/features/audit`
- `src/features/imports`
- `src/features/catalog`
- `src/pages`
- `src/routes`
- `src/lib`

### Roteamento
O roteador principal define:
- `/`
- `/login`
- `/app`
- `/app/assets`
- `/app/assets/new`
- `/app/assets/:assetId`
- `/app/assets/:assetId/edit`
- `/app/users`
- `/app/users/new`
- `/app/users/:userId`
- `/app/users/:userId/edit`
- `/app/audit-logs`
- `/app/imports`

A área `/app` é protegida por sessão e renderizada dentro do `AuthenticatedShell`.

---

## 6. Modelo de autenticação web

### Estratégia adotada
O frontend **não usa JWT em localStorage ou sessionStorage**.

Em vez disso, o app segue um modelo de **sessão web por cookie**, alinhado ao backend:
- login em `/api/v1/web/auth/login`
- leitura da sessão atual em `/api/v1/web/auth/me`
- logout em `/api/v1/web/auth/logout`

### Como o frontend trabalha
O `HttpClient` do projeto:
- usa `credentials: 'include'`
- envia cookies automaticamente
- injeta o header `X-CSRF-Token` em métodos mutantes (`POST`, `PUT`, `PATCH`, `DELETE`) quando encontra o cookie CSRF correspondente
- trata `204 No Content`
- lança `HttpError` para respostas não-ok

### Sessão no frontend
O estado de sessão é tratado via **TanStack Query**, não por contexto global pesado:
- query de sessão atual
- mutation de login
- mutation de logout

### Guards de rota
- `RequireSession`
  - exige sessão ativa para entrar na área autenticada
- `RedirectIfAuthenticated`
  - impede acesso desnecessário ao login quando já existe sessão

### Implicação de segurança
Essa foi uma decisão central do projeto:
- browser auth com cookie + CSRF
- sem token exposto ao JS como mecanismo principal de autenticação
- UX persistente em refresh e multi-tab
- alinhamento com um posicionamento security-first

---

## 7. Shell autenticado e linguagem visual

### Shell
A área autenticada usa um `AuthenticatedShell` com:
- header fixo/sticky
- navegação principal
- dados básicos da sessão atual
- ação de logout

### Navegação principal
- Overview
- Assets
- Users
- Imports
- Audit Logs

### Direção visual consolidada
O projeto foi levado para uma linguagem de **admin B2B séria**, evitando:
- cara de landing page
- cards gigantes sem densidade
- exagero visual
- estética “security dashboard” chamativa

### Elementos visuais importantes já consolidados
- `PageHeader` reutilizável para páginas principais
- tabelas nas listagens principais (assets, users, audit logs)
- labels legíveis para enums crus da API
- badges/pills discretas para status
- microinterações leves
- responsividade básica melhorada

---

## 8. Módulos do produto

### 8.1 Home pública
A rota `/` funciona como porta de entrada simples do produto.

Objetivo:
- apresentar o AssetDock Web de forma contida
- apontar claramente para login
- evitar parecer placeholder cru

### 8.2 Login
A rota `/login` é o ponto de entrada da sessão web.

Características:
- formulário com email e password
- validação com React Hook Form + Zod
- integração real com o backend
- redirecionamento para `/app` quando autenticado
- bloqueio do login quando já existe sessão ativa

### 8.3 Overview
A rota `/app` funciona como overview do produto.

Características:
- page header consistente
- cartões curtos com contagem real de assets e users
- links rápidos para as áreas principais
- intenção de ajudar a demo, sem virar “dashboard fake”

### 8.4 Assets
É um dos módulos centrais do MVP.

#### O que existe
- listagem de assets
- criação
- detalhe
- edição
- atualização de status
- archive
- vínculo com assignments

#### Listagem
A listagem foi evoluída para tabela com:
- status
- tag
- name
- serial
- ação de view

A UI foi ajustada para mais densidade e legibilidade operacional.

#### Detalhe
O detalhe de asset exibe:
- nome / tag
- status
- serial number
- hostname
- description
- archivedAt
- link de edição
- bloco de lifecycle
- seção de assignments

#### Lifecycle
O detalhe já suporta:
- update de status
- archive com confirmação simples
- mensagens de erro enxutas ligadas ao runtime do backend

### 8.5 Assignments
Assignments vivem dentro do detalhe do asset.

#### O que existe
- listagem do histórico
- atribuição de asset a um usuário
- unassign
- seleção opcional de location
- notes opcionais

#### Lookups usados
- usuários ativos
- locations ativas

#### Objetivo da UI
Ser funcional e direta, não sofisticada:
- form simples
- histórico básico
- badges de assignment ativo/fechado

### 8.6 Users
Outro módulo importante do MVP.

#### O que existe
- listagem
- detalhe
- criação
- update de status
- update de roles
- edição de perfil (rota já existente)

#### Listagem
A listagem de users foi levada para tabela com:
- status
- name
- email
- roles
- link de detalhe

#### Detalhe
O detalhe exibe:
- full name
- email
- status
- roles
- createdAt
- updatedAt

Também há ações de lifecycle:
- select simples para status
- seleção múltipla de roles
- salvamento separado para cada bloco

### 8.7 Audit Logs
A rota `/app/audit-logs` oferece visão operacional somente leitura dos eventos auditáveis.

A tabela exibe:
- time
- event
- outcome
- actor
- target

A UX foi refinada para aumentar densidade e legibilidade, sem cair em tabela pesada demais.

### 8.8 Imports
A rota `/app/imports` é a porta de entrada para importação CSV.

#### O que existe
- seleção de arquivo CSV
- upload multipart para o backend
- consulta do job retornado
- resumo do job de import

#### Objetivo
Oferecer uma UX mínima e honesta para o fluxo de import sem abrir complexidade desnecessária como:
- drag and drop avançado
- histórico completo de jobs
- polling automático sofisticado

---

## 9. Catálogos e lookups

O create/edit de asset já suporta lookups reais de:
- categories
- manufacturers
- locations

Esses lookups foram conectados ao backend e mantidos simples:
- selects opcionais
- sem autocomplete sofisticado
- sem criação inline de catálogos

---

## 10. Cliente HTTP e integração com backend

### Base URL
O projeto usa `VITE_API_URL`, com `.env.example` apontando para:
- `http://localhost:8080`

### Características do cliente
- suporta JSON automaticamente
- preserva `FormData` para upload multipart
- usa `credentials: 'include'`
- adiciona CSRF header quando apropriado
- trata status 204 sem tentar ler JSON

### Integração real já validada
Pelo histórico consolidado do projeto, os fluxos reais já foram validados contra o backend local, incluindo:
- login/logout
- sessão persistente em refresh
- assets list/detail/create/edit/lifecycle
- assignments
- users list/detail/create/lifecycle
- audit logs
- imports entry point

---

## 11. Testes

### Tipo de cobertura atual
O projeto não tenta cobrir tudo com testes extensos; ele usa uma suíte **smoke E2E enxuta com Playwright** para validar o coração do MVP.

### O que os smoke tests cobrem
- login
- refresh mantendo sessão
- logout
- assets list/detail
- create asset
- users list/detail
- audit logs page
- imports page
- user edit flow

### Configuração Playwright
- base URL configurável por `PLAYWRIGHT_BASE_URL`
- projeto principal em Chromium desktop
- reporter simples (`list`)
- trace em primeiro retry

### Variáveis suportadas pelos testes
- `PLAYWRIGHT_BASE_URL`
- `PLAYWRIGHT_LOGIN_EMAIL`
- `PLAYWRIGHT_LOGIN_PASSWORD`

### Intenção da suíte
Garantir confiança real no MVP sem criar um harness pesado ou frágil.

---

## 12. Demo

O projeto já possui um roteiro curto em `docs/demo-script.md`.

### Fluxo sugerido da demo
1. login
2. mostrar shell autenticado
3. abrir assets e criar asset de exemplo
4. mostrar detalhe, lifecycle e assignments
5. abrir users
6. abrir audit logs
7. abrir imports
8. logout

### Duração esperada
3 a 7 minutos.

### Valor da demo
A demo reforça:
- sessão web por cookie
- navegação autenticada real
- CRUD foundation de assets/users
- lifecycle actions
- visibilidade operacional em audit logs
- import entry point conectado ao backend

---

## 13. Convenções e regras do repositório

O repositório já possui um `AGENTS.md` que formaliza regras para agentes/IA.

### Princípios principais registrados
- sem scope creep
- tom técnico e sério
- estética B2B/admin
- mudanças incrementais
- sem documentação inventada
- validação obrigatória com build e lint
- resumo estruturado ao fim de cada tarefa

### Implicação prática
Qualquer evolução futura deve respeitar essa linha:
- alterações pequenas
- sem inflar a arquitetura
- sem “inventar moda”
- preservando o caráter de ferramenta séria

---

## 14. Branching e estilo de trabalho que funcionaram bem

Ao longo do desenvolvimento, o projeto foi tocado com uma disciplina saudável de branches pequenas e bem delimitadas.

### Padrão observado
- branches por feature/etapa
- PRs pequenas e objetivas
- merge em `main`
- limpeza de branches antigas depois da consolidação

Isso é importante manter no futuro.

---

## 15. O que já foi melhorado visualmente

Houve um ciclo real de amadurecimento visual do front.

### Antes
- cara mais crua de MVP técnico
- espaço vazio excessivo
- menos densidade visual
- algumas listas mais soltas

### Depois
- shell mais forte
- page headers consistentes
- home e login mais resolvidos
- listas principais em tabelas
- labels mais humanos para enums
- overview com dados reais
- navegação de retorno corrigida
- melhor responsividade básica

---

## 16. O que ainda pode entrar em ciclos futuros

Este item **não é roadmap fixo**, só um mapa possível de evolução.

### Melhorias possíveis pós-MVP
- screenshots de demo melhores
- README/apresentação ainda mais forte
- CI mínima para build/lint, se ainda não estiver consolidada
- testes E2E adicionais de alto valor
- refinamentos de acessibilidade
- melhorias de UX em imports
- filtros/paginação mais maduros
- edição de usuário mais completa

Mas o princípio é: **abrir novo ciclo conscientemente**, não no impulso.

---

## 17. Avaliação honesta do projeto

### Pontos fortes
- arquitetura web auth correta para browser
- integração real com backend
- separação clara frontend/backend
- escopo de MVP bem fechado
- evolução incremental com disciplina
- visual já compatível com um admin B2B sério
- smoke tests e demo script já presentes

### Limitações atuais
- documentação ainda pode amadurecer
- suíte de testes ainda é propositalmente enxuta
- ainda há espaço para refinamentos visuais finos
- alguns fluxos seguem deliberadamente simples para evitar sobrepeso no MVP

---

## 18. Resumo executivo

Se eu precisasse resumir o `assetdock-web` em poucas linhas:

> O AssetDock Web é um frontend React/Vite sério e orientado a operação para o ecossistema AssetDock, construído como companion app do `assetdock-api`. Ele já entrega um MVP funcional com autenticação web por cookie, gestão de assets, assignments, users, audit logs e imports, validado contra o backend real e com uma base visual B2B/admin já consolidada.

---

## 19. Checklist rápido para retomada futura

Quando retomar o projeto, lembrar de verificar:
- `main` alinhada com `origin/main`
- estado do `README.md`
- `AGENTS.md`
- smoke E2E (`npm run e2e`)
- `docs/demo-script.md`
- `.env.example`
- se o próximo passo é:
  - documentação
  - demo assets
  - CI
  - ou novo ciclo funcional

---

## 20. Frase-guia para decisões futuras

> Manter o AssetDock Web como uma ferramenta B2B/admin séria, clara, segura e incremental — sem inflar a arquitetura, sem reabrir escopo no impulso e sem deixar o projeto com cara de scaffold artificial.
