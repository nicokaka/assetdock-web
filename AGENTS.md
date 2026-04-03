# Agent Instructions for AssetDock Web

This file provides the persistent context and operational rules for any AI agent interacting with the `assetdock-web` repository.

## Repository Context
* **Project**: AssetDock Web (Frontend interface).
* **Backend Companion**: `assetdock-api` (resides in a separate repository alongside this one).
* **Current Status**: The web MVP is **completed** and consolidated in `main`.
* **MVP Features Included**: Cookie-based session authentication, Assets, Assignments, Users, Audit Logs, Imports, Playwright E2E smoke tests, and a consolidated visual pass.
* **Architecture**: React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7, React Query 5. 

## Core Principles
1. **No Scope Creep**: Do not invent or open new large functional scopes without explicit user instruction. The MVP is done.
2. **Technical & Serious**: Maintain a technical, direct, and professional tone. Avoid marketing buzzwords, emojis, or "AI scaffold" appearances.
3. **B2B Aesthetic**: The UI must remain serious, simple, intuitive, and clean (B2B Admin panel style). Do not inflate the component architecture unnecessarily.
4. **Incremental Changes**: Favor small, well-defined tasks using feature/fix branches. 
5. **No Hallucinations**: Do not write invented documentation, fake roadmaps, obvious comments, or fake placeholder screenshots.

## Validation Requirements
Every proposed change, no matter how small, **must** be validated prior to completion:
* Run `npm run lint` to ensure ESLint/TypeScript strict rules pass.
* Run `npm run build` to ensure Vite successfully bundles the app.
* Verify behavior in runtime when applicable.

## Task Completion Protocol
At the end of every task execution, the agent must output a structured summary containing exactly:
1. What was done.
2. Files modified/added/deleted.
3. Results of validations (`build` and `lint`).
4. Current branch name.
5. Upstream tracking branch.
6. Last commit hash and message.
7. Current working tree status.
