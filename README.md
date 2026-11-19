# Orders API

A small Express + TypeScript HTTP API exposing a `GET /orders` endpoint, with
OpenAPI documentation in `docs/openapi.yaml` and a Vitest test suite in
`tests/orders.spec.ts`.

## Requirements

- Node.js >= 18

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

The server listens on `http://localhost:3000` by default.

## Test

```bash
npx vitest run
```

## Project layout

- `src/server.ts` – Express app and route handlers.
- `src/data.ts` – In-memory orders dataset.
- `docs/openapi.yaml` – OpenAPI 3 specification for the HTTP API.
- `tests/orders.spec.ts` – Vitest + supertest integration tests.
