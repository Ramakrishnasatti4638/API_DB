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

The database file (`notes.db`) is created in the working directory on first
run, so no migrations or manual setup steps are needed.

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

The schema is created automatically on startup if the tables do not already
exist.

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

### `GET /api/notes`

Returns all notes, newest first.

```bash
curl http://localhost:3000/api/notes
```

**Response (`200`):**

```json
[
  {
    "id": 1,
    "title": "My Note",
    "body": "Note content",
    "created_at": "2026-06-17 06:54:34"
  }
]
```

### `POST /api/notes`

Creates a new note.

**Request body:**

```json
{ "title": "Note Title", "body": "Note content" }
```

`title` defaults to `"Untitled"` and `body` defaults to `""` when omitted.

**Response (`201`):**

```json
{
  "id": 1,
  "title": "Note Title",
  "body": "Note content",
  "created_at": "2026-06-17 06:54:34"
}
```

### `DELETE /api/notes/:id`

Deletes a note by ID.

**Response (`200`):**

```json
{ "message": "Note deleted successfully" }
```

If no note exists with the given ID the response is `404`:

```json
{ "error": "Note not found" }
```

### `GET /api/messages`

Returns all messages, newest first.

```bash
curl http://localhost:3000/api/messages
```

**Response (`200`):**

```json
[
  {
    "id": 1,
    "content": "Hello",
    "sender": "alice",
    "created_at": "2026-06-17 06:54:34",
    "updated_at": "2026-06-17 06:54:34"
  }
]
```

### `POST /api/messages`

Creates a new message. Both `content` and `sender` are required.

**Request body:**

```json
{ "content": "Hello", "sender": "alice" }
```

**Response (`201`):**

```json
{
  "id": 1,
  "content": "Hello",
  "sender": "alice",
  "created_at": "2026-06-17 06:54:34",
  "updated_at": "2026-06-17 06:54:34"
}
```

If either field is missing or empty, the response is `400`:

```json
{ "error": "Content and sender are required" }
```

### `GET /api/messages/:id`

Returns a single message by ID.

**Response (`200`):** the message object. If the ID is unknown the
response is `404`:

```json
{ "error": "Message not found" }
```

### `PUT /api/messages/:id`

Updates an existing message. Only the fields present in the request body
are changed; omitted fields keep their current value. `updated_at` is
always refreshed.

**Request body:**

```json
{ "content": "Updated", "sender": "bob" }
```

**Response (`200`):** the updated message object. If the ID is unknown the
response is `404`:

```json
{ "error": "Message not found" }
```

### `DELETE /api/messages/:id`

Deletes a message by ID.

**Response (`200`):**

```json
{ "message": "Message deleted successfully" }
```

If no message exists with the given ID the response is `404`:

```json
{ "error": "Message not found" }
```

### `POST /submit`

Scores a quiz submission against a fixed five-question answer key.

**Request body:**

```json
{ "answers": ["A", "B", "C", "A", "D"] }
```

**Response (`200`):**

```json
{ "score": 5, "total": 5 }
```

If `answers` is not an array, the response is `400`:

```json
{ "error": "Answers must be an array" }
```

## Error handling

Handlers wrap their work in `try/catch` and translate unexpected failures
into a `500` response with a JSON body:

```json
{ "error": "<error message>" }
```

Every error response uses the same `{ "error": ... }` shape, so clients can
handle failures with a single code path. Database errors are surfaced this
way rather than crashing the process.

## CORS

CORS is enabled for all origins via the `cors` middleware, so a frontend
running on a different port (for example `http://localhost:5173`) can call
the API directly without a proxy.

## Data persistence

Notes and messages are stored in the `notes.db` SQLite file in the project
root. Data persists across server restarts. Delete the file to reset the
database to an empty state — it is recreated automatically on the next
start.

## Testing

The API was verified end-to-end against a live server. Every endpoint and
error path above was exercised with `curl` against the running service,
including the `201`/`200`/`400`/`404` responses shown in this document.

## Project history

The repository has also carried a **FastAPI** variant of the service that
exposes a sample product catalog with an optional Redis cache. It is
documented separately on the branches that introduced it:

- `GET /api/products` — returns the full product list.
- `GET /api/products/{id}` — returns a single product, or `404` when the ID
  is unknown.

The cache is cache-aside and **fails soft**: when Redis is unreachable the
API keeps serving responses instead of raising errors.

## Contributing

1. Create a branch from `main`.
2. Make your change, keeping commits focused and descriptive.
3. Verify the API still starts cleanly and responds as documented above.
4. Open a pull request describing what changed and how it was verified.

## License

MIT
