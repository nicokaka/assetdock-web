# AssetDock API — Contexto Técnico Completo

> Documento de contexto para Obsidian.
> 
> Objetivo: servir como referência estável para futuras implementações, manutenção, onboarding e decisões de produto/arquitetura do **AssetDock API**.

---

## 1. Visão do projeto

**AssetDock API** é uma plataforma backend de inventário de ativos, multi-tenant, com foco explícito em segurança, auditabilidade e integridade operacional.

Ele foi construído como:
- **backend security-first**
- **projeto de portfólio internacional**
- **base de produto real**, não apenas um CRUD de demonstração

A proposta central do projeto é:
- controlar ativos por organização
- garantir isolamento entre tenants
- aplicar RBAC de forma consistente
- registrar trilhas de auditoria imutáveis
- tratar abuso de autenticação, importação e leitura de forma explícita
- entregar uma base robusta para um frontend/admin app separado

Em termos de posicionamento, o AssetDock prova capacidade em:
- backend engineering
- product-minded architecture
- AppSec / Product Security thinking
- security controls aplicados no fluxo de negócio

---

## 2. Escopo atual do produto

O estado atual do repositório representa um **MVP concluído**, com hardening adicional já incorporado.

### O que já existe
- autenticação JWT
- RBAC com 5 papéis
- leitura tenant-scoped de organização
- gestão de usuários
- catálogos: categories, manufacturers, locations
- gestão de ativos
- atribuição/desatribuição de ativos
- importação CSV com job persistido
- audit logs persistidos e consultáveis
- controles de abuso em login e import
- limites de leitura/paginação
- docs de security assurance
- governança básica do repositório (`SECURITY.md`, `LICENSE`, Dependabot, CodeQL)

### O que o projeto deliberadamente não é
- não é um frontend
- não é um discovery tool/agent de inventário automático
- não é um conector genérico para qualquer banco legado
- não é microserviços
- não é uma plataforma de observabilidade pesada

---

## 3. Stack e base tecnológica

### Runtime / Framework
- Java 21
- Spring Boot 3.5.3
- Spring Web
- Spring Security
- Spring OAuth2 Resource Server
- Spring JDBC
- Spring Validation

### Persistência
- PostgreSQL 17
- Flyway
- HikariCP

### Segurança / Auth
- JWT assinado com segredo compartilhado (HMAC / HS256)
- fluxo adicional de sessão web com cookie para uso browser-oriented
- BCrypt para senhas

### Documentação / Operação
- SpringDoc OpenAPI / Swagger UI
- Spring Boot Actuator
- RFC 9457 / Problem Details

### Importação
- Apache Commons CSV

### Testes / Qualidade
- JUnit 5
- Spring Security Test
- Testcontainers (PostgreSQL)
- GitHub Actions CI
- CodeQL
- Dependabot

---

## 4. Estrutura arquitetural

O projeto segue o modelo de **monólito modular**.

### Contextos/módulos principais
- `auth`
- `user`
- `organization`
- `catalog`
- `asset`
- `assignment`
- `importer`
- `audit`
- `security`
- `common`
- `config`

### Regra de organização interna
Cada módulo segue a convenção:
- `api`
- `application`
- `domain`
- `infrastructure`

### Princípios já estabelecidos
- modularidade por domínio
- shared-schema multi-tenancy
- forward-only migrations
- service-layer authorization
- segurança explícita em vez de “defaults implícitos”
- superfície pública mínima e sanitizada

---

## 5. Modelo de multi-tenancy

O AssetDock usa **shared-schema multi-tenancy**.

### Como funciona
- entidades com escopo de tenant carregam `organization_id`
- leituras e escritas são delimitadas por `organization_id`
- o enforcement principal está na camada de aplicação/autorização
- `SUPER_ADMIN` é a exceção global explícita

### Regra atual de identidade
- `users.email` é **globalmente único**
- usuários tenant-scoped pertencem a **uma organização** no MVP
- `SUPER_ADMIN` pode existir com `organization_id = null`

### Motivação
Essa decisão reduz ambiguidade de login e simplifica o modelo do MVP, deixando a evolução futura mais próxima de `identity + memberships` do que de “e-mails duplicados por tenant”.

---

## 6. Modelo de segurança

## 6.1 RBAC
Papéis atuais:
- `SUPER_ADMIN`
- `ORG_ADMIN`
- `ASSET_MANAGER`
- `AUDITOR`
- `VIEWER`

### Leitura prática dos papéis
- `SUPER_ADMIN`: escopo global
- `ORG_ADMIN`: administração tenant-scoped
- `ASSET_MANAGER`: mutação operacional de ativos/importações/assignments
- `AUDITOR`: leitura de trilhas e informações auditáveis
- `VIEWER`: leitura restrita

## 6.2 Autorização
A autorização principal ocorre na camada de serviço, centralizada por regras explícitas e pelo `TenantAccessService`.

### Filosofia
- role sem tenant scope não basta
- a aplicação nega cross-tenant access por padrão
- mutações sensíveis exigem papel e contexto corretos

## 6.3 Hardening já implementado
- lockout por falhas de login consecutivas
- throttling de login
- throttling de import CSV
- audit logs persistidos para eventos sensíveis
- docs públicas desabilitadas por padrão
- erros públicos sem stacktrace/internal exception leakage
- limites de leitura/paginação
- validações tenant-aware em assets/assignments/imports

---

## 7. Autenticação atual

O backend hoje tem **dois modos relevantes de autenticação**, o que é importante para o futuro `assetdock-web`.

### 7.1 JWT bearer (API-oriented)
Endpoint:
- `POST /api/v1/auth/login`

Uso:
- clientes programáticos
- Postman / Swagger
- integrações externas
- frontend, se optar por bearer token explícito

### 7.2 Sessão web com cookie (browser-oriented)
Endpoints:
- `POST /api/v1/web/auth/login`
- `GET /api/v1/web/auth/me`
- `POST /api/v1/web/auth/logout`

Uso:
- browser/frontend web
- sessão baseada em cookie
- suporte a CSRF token

### Implicação importante
O backend **já possui preparação real para auth de frontend via sessão web**, o que reduz a necessidade de guardar JWT em `localStorage` e combina melhor com o posicionamento security-first do produto.

---

## 8. Superfície HTTP atual

### Auth
- `POST /api/v1/auth/login`
- `POST /api/v1/web/auth/login`
- `GET /api/v1/web/auth/me`
- `POST /api/v1/web/auth/logout`

### Organizations
- `GET /organizations/{id}`

### Users
- `POST /users`
- `GET /users`
- `GET /users/{id}`
- `PATCH /users/{id}`
- `PATCH /users/{id}/roles`
- `PATCH /users/{id}/status`

### Catalog
- `POST /categories`
- `GET /categories`
- `PATCH /categories/{id}`
- `POST /manufacturers`
- `GET /manufacturers`
- `PATCH /manufacturers/{id}`
- `POST /locations`
- `GET /locations`
- `PATCH /locations/{id}`

### Assets
- `POST /assets`
- `GET /assets`
- `GET /assets/{id}`
- `PATCH /assets/{id}`
- `PATCH /assets/{id}/status`
- `PATCH /assets/{id}/archive`

### Assignments
- `POST /assets/{assetId}/assignments`
- `POST /assets/{assetId}/unassign`
- `GET /assets/{assetId}/assignments`

### Importer
- `POST /imports/assets/csv`
- `GET /imports/assets/{jobId}`

### Audit
- `GET /audit-logs`
- `GET /api/v1/audit-logs`

### Operational
- `GET /actuator/health`
- Swagger/OpenAPI apenas quando habilitados por perfil/config

---

## 9. Módulos de negócio

## 9.1 Organization
Escopo atual enxuto:
- leitura da própria organização
- leitura por `SUPER_ADMIN`

É pequeno de propósito: a organização funciona como raiz do tenant.

## 9.2 User
Cobertura atual:
- criação de usuário
- listagem
- leitura por ID
- update de perfil
- update de roles
- update de status
- proteções contra ações administrativas perigosas
  - remover último admin efetivo
  - self-lock / self-disable destrutivo
  - atribuição inválida de `SUPER_ADMIN`

## 9.3 Catalog
Entidades:
- categories
- manufacturers
- locations

Fluxos:
- criação
- listagem
- update parcial
- desativação via `active=false`

## 9.4 Asset
Fluxos:
- criação
- listagem
- leitura por ID
- update parcial
- update de status
- archive explícito

Proteções:
- bloqueio de mutation em asset arquivado
- validações tenant-aware de category/manufacturer/location/current assigned user

## 9.5 Assignment
Fluxos:
- assign
- unassign
- histórico por asset

Proteções:
- uma atribuição ativa por ativo
- bloqueio para asset arquivado
- bloqueio para user `INACTIVE`/`LOCKED`
- bloqueio para location inativa em novas assignments
- sincronismo com snapshot atual do asset

## 9.6 Importer
Fluxos:
- upload de CSV de assets
- criação de job persistido
- partial success por linha
- consulta do job

Proteções:
- limite de tamanho
- limite de linhas
- validação de header
- rejeição de arquivo vazio
- rejeição de `asset_tag` duplicado dentro do mesmo upload
- tratamento seguro de linha malformada
- throttling específico do endpoint

## 9.7 Audit
Fluxos:
- persistência de audit events
- leitura com paginação/filtros simples

Cobertura de eventos:
- login success/failure
- lock automático de usuário
- criação/alteração de usuário
- lifecycle de catálogo e asset
- assignments
- import CSV
- eventos de sessão web

---

## 10. Configuração operacional

## 10.1 Profiles
- `local` é o profile default
- Swagger/UI e docs ficam habilitados em `local`
- docs públicas também podem ser habilitadas por `PUBLIC_DOCS_ENABLED=true`

## 10.2 Banco
- Postgres local via Docker Compose
- datasource configurável por env vars
- Flyway habilitado

## 10.3 Variáveis importantes
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `JWT_ISSUER`
- `LOCAL_FRONTEND_ORIGINS`
- `LOCAL_SEED_*`

## 10.4 Seed local
Há suporte a seed local controlado por configuração, útil para desenvolvimento.

---

## 11. CORS e readiness para frontend

Esse ponto é importante para a próxima etapa (`assetdock-web`).

### Estado atual
- CORS não está aberto amplamente em produção
- no profile `local`, origens explícitas podem ser configuradas via `LOCAL_FRONTEND_ORIGINS`
- default local preparado:
  - `http://localhost:3000`
  - `http://localhost:5173`

### Resultado prático
O backend já está pronto para ser consumido por um frontend separado em desenvolvimento local, sem abrir a superfície de produção além do necessário.

---

## 12. Sessão web e implicações para o frontend

Isso é um dos pontos mais importantes para o futuro do produto.

### O que já existe no backend
- endpoints de login/logout/me para sessão web
- cookie de sessão HttpOnly
- cookie CSRF separado
- filtro de autenticação por sessão web
- testes de integração cobrindo criação e invalidação da sessão

### Implicação
O `assetdock-web` não precisa necessariamente nascer consumindo a API apenas com JWT bearer em `localStorage`.

Há base para um fluxo mais alinhado com security-first:
- login web via cookie
- sessão browser-oriented
- proteção CSRF

Esse é um ponto forte do projeto e deve ser considerado no desenho do frontend.

---

## 13. Qualidade, testes e pipeline

## 13.1 Testes
O repositório já usa:
- unit tests
- integration tests com PostgreSQL real via Testcontainers

Cobertura declarada e já exercida no projeto:
- auth login
- token boundaries
- web session auth/CSRF
- users
- organization read
- catalog
- assets
- assignments
- importer
- audit read/write
- operational surface
- CORS local
- error/contract paths

## 13.2 CI
Pipeline em GitHub Actions:
- Java 21
- `./gradlew clean check --stacktrace`
- roda em push para `main` e PRs

## 13.3 Segurança do repositório
- `SECURITY.md`
- `LICENSE` MIT
- Dependabot semanal para Gradle e GitHub Actions
- CodeQL no GitHub Actions

---

## 14. Security assurance docs já existentes

O repositório possui documentação de assurance em `docs/security/`:
- `threat-model.md`
- `trust-boundaries.md`
- `abuse-cases.md`
- `security-decisions.md`

Esses documentos já conectam a implementação a uma narrativa clara de AppSec/Product Security.

### Valor prático
Eles ajudam a explicar:
- quais ameaças o sistema considera
- quais fronteiras de confiança existem
- que abusos foram tratados no código
- quais decisões de segurança foram assumidas conscientemente

---

## 15. Trade-offs e limitações atuais

### Deliberadamente fora do escopo atual
- MFA / TOTP
- refresh token rotation completa
- revogação sofisticada de token
- throttling distribuído entre múltiplas instâncias
- background jobs para importações grandes
- malware scanning de upload
- SIEM / alerting externo
- observabilidade pesada
- infraestrutura/cloud hardening fora da aplicação
- frontend completo (ainda em separado)

### Trade-offs assumidos
- shared-schema multi-tenancy em vez de isolamento físico por banco/schema
- service-layer authorization em vez de depender só de anotações de segurança
- throttling local/in-memory por ser um projeto pequeno e coerente
- imports síncronos e limitados para manter comportamento previsível

---

## 16. Estado atual de maturidade

Leitura honesta do projeto neste momento:

### Como backend/MVP
- concluído
- pronto para demonstração pública
- pronto para servir como base de frontend

### Como projeto de portfólio
- forte para backend + security
- já demonstra maturidade acima de CRUD comum
- tem narrativa clara para AppSec / Product Security

### O que falta para o produto como experiência completa
- `assetdock-web`
- demo navegável
- talvez deploy público + screencast curto

---

## 17. O que o projeto prova profissionalmente

O AssetDock API prova que o autor consegue:
- modelar um backend multi-tenant real
- implementar RBAC de forma útil
- pensar tenant isolation como regra central, não detalhe
- construir auditabilidade de ações críticas
- tratar auth e import como superfícies de abuso
- documentar decisões e ameaças de forma madura
- entregar CI/testes/governança e não só código funcional

Esse é o valor central do projeto.

---

## 18. Próximo passo lógico

O próximo passo natural **não é mais backend**.

O próximo passo lógico é:
- criar o repositório **`assetdock-web`**
- manter `assetdock-api` como backend estável
- construir um frontend fino, seguro e demonstrável

### Recomendação de direção para o frontend
- repo separado
- foco em UX admin-oriented
- primeira fase pequena:
  - login
  - dashboard
  - assets
  - audit log viewer
  - import CSV com feedback visual
- evitar onboarding wizard cedo demais
- aproveitar a base já existente de sessão web/cookie no backend

---

## 19. Resumo executivo

**AssetDock API** é um backend multi-tenant de inventário de ativos, projetado como monólito modular security-first, com RBAC, audit trail, importação CSV limitada, proteções contra abuso, docs de assurance e readiness para um frontend separado.

Ele já está forte como base técnica e como peça de portfólio.

A estratégia correta daqui para frente é:
1. tratar o backend como estável
2. evitar reabrir o core sem necessidade
3. construir o `assetdock-web` em repositório separado
4. usar a camada web para transformar o projeto em produto demonstrável no navegador

---

## 20. Referências do repositório usadas como base

Arquivos-chave analisados:
- `README.md`
- `README.pt-BR.md`
- `build.gradle`
- `src/main/resources/application.yml`
- `src/main/resources/application-local.yml`
- `src/main/java/com/assetdock/api/security/config/SecurityConfig.java`
- `src/main/java/com/assetdock/api/auth/application/AuthenticationService.java`
- `src/main/java/com/assetdock/api/auth/api/AuthController.java`
- `src/main/java/com/assetdock/api/auth/api/WebAuthController.java`
- `src/main/java/com/assetdock/api/security/auth/WebSessionAuthenticationFilter.java`
- `src/main/java/com/assetdock/api/user/api/UserController.java`
- `src/main/java/com/assetdock/api/organization/api/OrganizationController.java`
- `src/main/java/com/assetdock/api/asset/api/AssetController.java`
- `src/main/java/com/assetdock/api/assignment/api/AssetAssignmentController.java`
- `src/main/java/com/assetdock/api/importer/api/AssetCsvImportController.java`
- `src/main/java/com/assetdock/api/audit/api/AuditLogController.java`
- `docs/adr/ADR-001-global-unique-email.md`
- `docs/security/*`
- `.github/workflows/ci.yml`
- `.github/workflows/codeql.yml`
- `.github/dependabot.yml`
- `.env.example`
- `docker-compose.yml`

