# AssetDock Web

AssetDock Web is the frontend companion for the AssetDock API. It is an internal web application designed to manage the lifecycle of IT assets and their assignments to users. This repository contains a consolidated Minimum Viable Product (MVP) that is fully integrated with the backend API.

## Technology Stack

* React 19
* TypeScript
* Vite
* Tailwind CSS v4 and Radix UI
* React Router DOM v7
* TanStack React Query v5
* React Hook Form and Zod
* Playwright

## MVP Features

The current implementation provides functional interfaces for the following core areas:

* **Authentication**: Login and logout flows interacting with the backend session management.
* **Assets**: Comprehensive CRUD operations, lifecycle tracking, and management of asset states and assignments.
* **Assignments**: Workflows to allocate and reclaim assets from users.
* **Users**: Listing and detailed views of user profiles and their corresponding asset assignments.
* **Audit Logs**: A read-only interface to view the operational trail of the system.
* **Imports**: An entry point to submit CSV files for batch importing of assets and user data.

## Relationship with AssetDock API

This web client is designed to operate seamlessly with the `assetdock-api`. It relies entirely on the API for data persistence, business logic, and session state. The frontend acts as a thin presentation layer, consuming the JSON endpoints exposed by the API and rendering the application state accordingly. Local development requires the backend to be running concurrently or configured to point to a valid API instance.

## Authentication and Security Notes

The application implements a secure, cookie-based authentication mechanism.
* **Session Management**: Authentication tokens are not stored in the frontend directly (e.g., LocalStorage or SessionStorage). Instead, secure, HTTP-only cookies are utilized and managed by the backend.
* **CSRF Protection**: The application is configured to handle Anti-CSRF mechanisms provided by the backend to prevent cross-site request forgery attacks.
* The frontend coordinates the login credentials and relies on the browser's native cookie handling for authenticated requests.

## Configuration

Environment variables are used to configure the application for different environments. Create a `.env` file in the root directory based on the provided `.env.example`.

Main variables:
* `VITE_API_URL`: The base URL for the `assetdock-api` instances (e.g., `http://localhost:8080`).

## Running Locally

To set up and run the application locally, ensure Node.js is installed.

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Testing

The project includes smoke tests covering main user flows using Playwright.

```bash
# Run tests headlessly
npm run e2e

# Run tests with visible browser
npm run e2e:headed
```

## Demo Script

A detailed walkthrough of the optimal demo flow exists in `docs/demo-script.md`. It outlines the recommended path to showcase the core MVP features, involving user authentication, asset creation, and audit log reviews.

## Project Status

The Web MVP is currently considered completed. The application features a consolidated visual pass, working routing, real integration with the API, and verified E2E smoke tests.
