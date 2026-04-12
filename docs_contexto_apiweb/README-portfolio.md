# AssetDock

A multi-tenant IT asset management platform built to track hardware, manage assignments, and maintain audit trails across organizations.

I built this because most ITAM tools I encountered during security work were either bloated enterprise software or glorified spreadsheets. Neither option gave me what I actually needed: a clean way to know where every laptop, server, and access badge is at any given moment — and who touched it last.

AssetDock is a full-stack web application with a Java/Spring Boot API and a React frontend, deployed to production with CI/CD. It handles the entire asset lifecycle from procurement to retirement, with proper role-based access control and a complete audit log.

---

## Screenshots

> **How to capture these screenshots:**
>
> 1. Open the app in Chrome at your deployed Vercel URL
> 2. Use DevTools → Toggle Device Toolbar (Ctrl+Shift+M) → set viewport to **1440×900**
> 3. Right-click → "Capture screenshot" for each view
> 4. Save them inside a `docs/screenshots/` folder in this repo
> 5. Rename each file to match the references below

<!-- LOGIN -->
### Authentication

![Login screen](docs/screenshots/login.png)

*Cookie-based session authentication with CSRF protection. No JWT in localStorage — sessions are managed server-side with HttpOnly cookies.*

---

<!-- DASHBOARD / OVERVIEW -->
### Dashboard

![Dashboard overview](docs/screenshots/dashboard.png)

*Organization-scoped overview. Each tenant sees only their own data.*

---

<!-- ASSET LIST -->
### Asset Registry

![Asset list](docs/screenshots/asset-list.png)

*Filterable asset inventory with status badges (Active, In Stock, Maintenance, Retired, Lost). Supports bulk CSV import for onboarding existing inventories.*

---

<!-- ASSET DETAIL -->
### Asset Detail & Lifecycle

![Asset detail](docs/screenshots/asset-detail.png)

*Full asset lifecycle management — status transitions, assignment history, and archival workflow with confirmation dialogs.*

---

<!-- AUDIT LOG -->
### Audit Trail

![Audit logs](docs/screenshots/audit-logs.png)

*Every mutation is recorded: who did what, when, and to which resource. This is the piece that matters most for compliance and incident response.*

---

<!-- USER MANAGEMENT -->
### User & Role Management

![User management](docs/screenshots/users.png)

*Role-based access control with five levels: Super Admin, Org Admin, Asset Manager, Auditor, and Viewer. Status management (Active / Inactive / Locked) for access control.*

---

## Why This Exists

Asset visibility is the first control in almost every security framework — CIS Control 1, NIST SP 800-53 CM-8, ISO 27001 A.8. You cannot protect what you cannot see and cannot account for.

I built AssetDock to solve that problem in a way that is practical for mid-size teams: straightforward to deploy, simple to operate, and designed with security principles from day one rather than bolted on afterwards.

It is also a reflection of how I think about software: pick the right constraints, build within them, ship something real.

---

## Architecture

```
┌─────────────┐        HTTPS         ┌──────────────┐       JDBC       ┌────────────┐
│   Browser    │ ◄──────────────────► │  Spring Boot │ ◄──────────────► │ PostgreSQL │
│  (React SPA) │   Cookie Sessions   │   REST API   │    Flyway Mgmt   │            │
│   Vercel     │   + CSRF Tokens     │   Railway    │                  │  Railway   │
└─────────────┘                      └──────────────┘                  └────────────┘
```

### Backend — `assetdock-api`

| Concern | Implementation |
|---|---|
| Runtime | Java 21, Spring Boot 3 |
| Auth | Cookie-based sessions, CSRF double-submit, HMAC-signed tokens |
| Multi-tenancy | Row-level organization scoping, enforced at the service layer |
| Database | PostgreSQL 16, managed migrations via Flyway |
| Testing | 27 test files, 18 integration tests using Testcontainers (real PostgreSQL) |
| Deploy | Railway, auto-deploy on push to `main` |

### Frontend — `assetdock-web`

| Concern | Implementation |
|---|---|
| Stack | React 19, TypeScript, Vite |
| Routing/State | React Router 7, TanStack Query 5 |
| Styling | Tailwind CSS 4, custom design system built on Radix primitives |
| Validation | Zod schemas, React Hook Form |
| E2E | Playwright smoke tests |
| Deploy | Vercel, auto-deploy on push to `main` |

### Key Technical Decisions

**Cookie sessions over JWT.** The frontend is a single-domain SPA — there is no cross-origin token exchange to justify JWT complexity. HttpOnly cookies with CSRF double-submit give better security properties for this use case, with less surface area for XSS-based token theft.

**Testcontainers over H2.** Integration tests run against real PostgreSQL instances spun up in Docker. H2 syntax differences cause false positives and miss real bugs. The CI pipeline takes a bit longer, but the tests actually mean something.

**Feature-first project structure.** Both repos organize code by domain (assets, users, assignments, audit) rather than by technical layer. This keeps related code together and makes the codebase navigable without a tutorial.

**No ORM magic.** The API uses Spring Data JPA for basic CRUD but avoids complex entity graphs, lazy loading traps, and N+1 patterns. Queries that need to perform are written explicitly.

---

## Security Design

Since this is an asset management tool — and since security is the field I work in — I took the security layer seriously rather than treating it as an afterthought:

- **Session management**: Server-side sessions with HttpOnly, Secure, SameSite cookies. No tokens in localStorage or sessionStorage.
- **CSRF protection**: Double-submit cookie pattern validated on every state-changing request (POST, PUT, PATCH, DELETE).
- **Multi-tenant isolation**: Organization-scoped queries enforced at the service layer. A user in Org A cannot access, modify, or even discover resources belonging to Org B.
- **Rate limiting**: Configurable per-endpoint throttling to mitigate brute-force and abuse.
- **Audit logging**: Immutable event log capturing every significant operation with actor identity, timestamp, and affected resource.
- **Role-based access**: Five-tier RBAC model (Super Admin → Viewer) enforced server-side. The frontend hides UI elements, but the API rejects unauthorized requests regardless.
- **Input validation**: Strict deserialization (`fail-on-unknown-properties`), Zod schemas on the frontend, Bean Validation on the backend. Unknown fields are rejected, not silently ignored.
- **Error handling**: RFC 7807 Problem Details for API errors. No stack traces leak to clients.

---

## Running Locally

### Prerequisites

- Java 21
- Node.js 20+
- Docker (for Testcontainers and local PostgreSQL)
- PostgreSQL 16 (or use the Docker Compose file)

### Backend

```bash
cd assetdock-api
cp .env.example .env          # Configure database credentials
./gradlew bootRun
```

The API starts at `http://localhost:8080`.

### Frontend

```bash
cd assetdock-web
cp .env.example .env          # Set VITE_API_URL=http://localhost:8080
npm install
npm run dev
```

The app starts at `http://localhost:5173`. The Vite dev server proxies `/api` requests to the backend.

### Tests

```bash
# Backend integration tests (requires Docker)
cd assetdock-api
./gradlew test

# Frontend E2E (requires both services running)
cd assetdock-web
npx playwright test
```

---

## Status

This is an MVP — complete and deployed, not a work in progress. The core workflows (asset CRUD, assignments, user management, audit) are functional and tested. There is no fake data, no placeholder pages, and no TODO comments pretending to be features.

Things I would add next if this were a product with users:
- Asset tagging via QR/barcode scanning
- Scheduled compliance reports (PDF export)
- Integration with identity providers (SAML/OIDC)
- Dashboard with asset distribution metrics

---

## About

Built by **Nicolas** — a software engineer moving into cybersecurity, currently preparing for a move to New Zealand.

This project reflects the overlap between those two worlds: you cannot build effective security operations without knowing what you are protecting, and you cannot build reliable software without thinking about how it will be attacked.

If you want to talk about the code, the architecture decisions, or anything related to AppSec and ITAM, feel free to reach out.

---

*The source code for the API and frontend lives in private repositories. This repo serves as documentation and portfolio reference.*
