# Orders API

A small Express + TypeScript HTTP API exposing `POST /orders` and `GET /orders` endpoints persisted in SQLite (`better-sqlite3`; file set by `DB_PATH`, default `orders.db`), with
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
- `src/db/` – SQLite connection and migrations.
- `src/repositories/orderRepository.ts` – transactional order persistence.
- `src/models/order.ts` – order types.
- `docs/openapi.yaml` – OpenAPI 3 specification for the HTTP API.
- `tests/orders.spec.ts` – Vitest + supertest integration tests.
