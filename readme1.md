# api_db — Notes & Messages API

A lightweight REST API backend built with **Express.js** and **SQLite**
(via `better-sqlite3`). The service provides persistent storage for notes
and short messages, exposed as a small JSON API suitable for use from a
browser frontend, a CLI client, or other backend services.

> This file (`readme1.md`) is the primary entry point for the repository.
> It describes the current shape of the project, how to run it, and how
> the public API is structured.

## Overview

`api_db` is a self-contained Node.js service:

- **Express 4** HTTP layer with CORS enabled and JSON request bodies.
- **better-sqlite3** for synchronous, file-backed SQLite storage — no
  external database server required.
- Two tables are created on startup (`notes`, `messages`), each with an
  auto-incrementing primary key and timestamp columns.
- The server listens on **port 3000** by default.

The database file is created in the working directory (`notes.db`) on
first run, so no migrations or setup steps are needed.

## Project layout

```
api_db/
├── server.js        # Express app, routes, SQLite schema bootstrap
├── package.json     # Dependencies and npm scripts
└── notes.db         # SQLite database (created at runtime)
```

## Requirements

- Node.js 18 or later
- npm 9 or later

## Installation

```bash
npm install
```

This installs the three runtime dependencies: `express`, `better-sqlite3`,
and `cors`.

## Running the server

```bash
npm start
# or, for development with the same behaviour:
npm run dev
```

Once running, the API is available at `http://localhost:3000`.

## Database schema

The schema is created automatically on startup if the tables do not
already exist.

```sql
notes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  body        TEXT    NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
)

messages (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  content     TEXT    NOT NULL,
  sender      TEXT    NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## API endpoints

### Notes

| Method | Path             | Description                |
| ------ | ---------------- | -------------------------- |
| GET    | `/api/notes`     | List all notes, newest first. |
| POST   | `/api/notes`     | Create a note.             |
| DELETE | `/api/notes/:id` | Delete a note by ID.       |

**Create a note**

```http
POST /api/notes
Content-Type: application/json

{ "title": "Shopping list", "body": "Milk, eggs, bread" }
```

Response (`201 Created`):

```json
{
  "id": 1,
  "title": "Shopping list",
  "body": "Milk, eggs, bread",
  "created_at": "2026-07-01 12:00:00"
}
```

### Messages

The `messages` table is created with the same pattern, exposing a
CRUD-style surface for short, sender-attributed text messages with both
`created_at` and `updated_at` timestamps. The exact route shape is
defined in `server.js`; refer to that file for the current routes.

## Error handling

All route handlers catch errors and return a JSON response of the form:

```json
{ "error": "<message>" }
```

with an appropriate HTTP status code (commonly `404` for missing
resources and `500` for unexpected failures).

## Development notes

- The database is opened once at startup; tables are created with
  `CREATE TABLE IF NOT EXISTS`, so restarting the server is safe.
- `better-sqlite3` is synchronous, so handlers do not need `async`/`await`
  for query calls.
- Because CORS is enabled with default settings, any origin can call the
  API during local development. Tighten this before deploying publicly.

## Getting started

1. Clone the repository.
2. Run `npm install`.
3. Run `npm start`.
4. Call the API with `curl`, your browser, or any HTTP client.

Example:

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","body":"First note"}'
```

## Conventions

- Keep commits small and focused with descriptive messages.
- Match the existing Express + SQLite style when adding routes.
- Update this file when the public API or runtime behaviour changes.

## License

Internal/demo project — license to be decided by the maintainers.
