# api_db — Notes, Messages & Quiz API

A small REST API backend built with **Node.js**, **Express 4**, and **SQLite**
(via `better-sqlite3`). It exposes JSON endpoints for notes and messages, plus a
small quiz-scoring route, backed by a file-based database that needs no external
database server.

> **Current status:** the source files (`server.js`, `package.json`, `.gitignore`)
> were removed in the most recent commits as part of a repository reorganization.
> This document captures the API contract, schema, and conventions that the
> implementation follows, so the services can be re-introduced cleanly.

## Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
  - [Notes](#notes)
  - [Messages](#messages)
  - [Quiz](#quiz)
- [Error Handling](#error-handling)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Conventions](#conventions)
- [Contributing](#contributing)
- [License](#license)

## Overview

`api_db` is a self-contained Node.js service:

- **Express 4** HTTP layer with CORS enabled and JSON request bodies.
- **better-sqlite3** for synchronous, file-backed SQLite storage — no database
  server or migration step required.
- Two tables are created on startup (`notes` and `messages`), each with an
  auto-incrementing primary key and timestamp columns.
- The server listens on **port 3000** by default.

The database file (`notes.db`) is created in the working directory on first run.
Data persists across server restarts.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Runtime | Node.js 18+ |
| HTTP framework | Express `^4.18.2` |
| Database | SQLite via `better-sqlite3` `^9.2.2` |
| Cross-origin | `cors` `^2.8.5` |

All SQL is executed through prepared statements with bound parameters, so user
input is never interpolated into a query string.

## Database Schema

```sql
notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)

messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  sender TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

Both tables are bootstrapped with `CREATE TABLE IF NOT EXISTS` on server start,
so the same startup path works for a fresh checkout and for an existing database.

## API Endpoints

All endpoints accept and return JSON.

### Notes

#### `GET /api/notes`

Returns every note, newest first (`ORDER BY created_at DESC`).

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

#### `POST /api/notes`

Creates a note. `title` defaults to `Untitled` and `body` to an empty string
when omitted.

**Request body:**

```json
{
  "title": "Note Title",
  "body": "Note content"
}
```

**Response — `201 Created`:**

```json
{
  "id": 1,
  "title": "Note Title",
  "body": "Note content",
  "created_at": "2026-06-17 06:54:34"
}
```

#### `DELETE /api/notes/:id`

Deletes a note by ID.

**Response — `200 OK`:**

```json
{
  "message": "Note deleted successfully"
}
```

**Response — `404 Not Found`** when no row matches the ID:

```json
{
  "error": "Note not found"
}
```

### Messages

#### `GET /api/messages`

Returns every message, newest first.

#### `GET /api/messages/:id`

Returns a single message by ID, or `404 Not Found` if it does not exist.

```json
{
  "id": 1,
  "content": "Hello there",
  "sender": "alice",
  "created_at": "2026-06-17 06:54:34",
  "updated_at": "2026-06-17 06:54:34"
}
```

#### `POST /api/messages`

Creates a new message. Both `content` and `sender` are required.

**Request body:**

```json
{
  "content": "Hello there",
  "sender": "alice"
}
```

**Response — `201 Created`:** the persisted message object.

**Response — `400 Bad Request`** if a required field is missing:

```json
{
  "error": "Content and sender are required"
}
```

#### `PUT /api/messages/:id`

Updates an existing message. Any field left out keeps its current value, and
`updated_at` is refreshed to the current timestamp.

**Request body:**

```json
{
  "content": "Updated content",
  "sender": "bob"
}
```

**Response — `200 OK`:** the updated message object.

**Response — `404 Not Found`** if the ID does not exist.

#### `DELETE /api/messages/:id`

Deletes a message by ID.

**Response — `200 OK`:**

```json
{
  "message": "Message deleted successfully"
}
```

**Response — `404 Not Found`** if no row matches the ID.

### Quiz

#### `POST /submit`

Scores a set of quiz answers against a fixed answer key.

**Request body:**

```json
{
  "answers": ["A", "B", "C", "A", "D"]
}
```

**Response — `200 OK`:**

```json
{
  "score": 5,
  "total": 5
}
```

**Response — `400 Bad Request`** if `answers` is not an array:

```json
{
  "error": "Answers must be an array"
}
```

## Error Handling

Every route wraps its work in a `try`/`catch` and returns a consistent JSON
error body:

| Status | Meaning |
| --- | --- |
| `200 OK` | Request succeeded |
| `201 Created` | Resource created |
| `400 Bad Request` | Missing or malformed input |
| `404 Not Found` | Resource does not exist |
| `500 Internal Server Error` | Unexpected server or database failure |

```json
{
  "error": "<message>"
}
```

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

The `dev` script runs the same entry point:

```bash
npm run dev
```

The API is then reachable at `http://localhost:3000`.

## Project Structure

```
api_db/
├── server.js        # Express app, routes, SQLite schema bootstrap
├── package.json     # Dependencies and npm scripts
├── notes.db         # SQLite database (created at runtime)
└── readme1.md       # This document
```

## Conventions

- **Prepared statements only** — every query uses `?` placeholders and bound
  parameters, keeping the service safe from SQL injection.
- **Consistent envelopes** — success returns the resource (or a `message` field
  for deletes); failure returns a single `error` field.
- **RESTful verbs** — `GET` for reads, `POST` for creation, `PUT` for updates,
  `DELETE` for removal.
- **Newest first** — list endpoints order by `created_at DESC`.
- **Timestamps** — `created_at` on insert, `updated_at` refreshed on update.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss the change, keep commits small and focused, and update this document
alongside any code change that affects the API contract.

## License

To be determined.
