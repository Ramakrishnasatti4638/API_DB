# readme1.md

Documentation for the **`api_db`** project — a collection of small REST API
services backed by a real database, built as a reference for API design,
persistence, validation, and caching.

## Overview

`api_db` groups together backend services that expose CRUD endpoints over a
persistent store. The project has iterated through several service
implementations:

| Service | Stack | Status |
| --- | --- | --- |
| Notes API | Node.js + Express + SQLite (`better-sqlite3`) | Reference implementation |
| Messages API | Node.js + Express + SQLite | Reference implementation |
| Quiz API | Node.js + Express | Scoring endpoint |
| Sample Store API | Python + FastAPI + Redis | Caching example |

> **Current status:** the working tree is being reorganised. The source files
> were removed in preparation for a clean re-introduction, and this document
> captures the API contract, schema, and conventions the services follow.

## Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Conventions](#conventions)
- [Contributing](#contributing)
- [License](#license)

## Features

- **RESTful design** — resource-oriented routes with conventional HTTP verbs
  and status codes.
- **Persistent storage** — SQLite via `better-sqlite3` for the Node services,
  with schemas created idempotently on boot.
- **Input validation** — required fields are checked before touching the
  database, and invalid requests return `400` with a JSON error body.
- **Consistent error contract** — every failure path returns
  `{ "error": "<message>" }` with the appropriate status code.
- **CORS enabled** — the API can be called directly from a frontend dev server.
- **Optional caching** — the FastAPI service degrades gracefully when Redis
  is unreachable instead of failing the request.

## Tech Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Runtime | Node.js 18+ (ESM and CJS both exercised) | `npm start` runs the server |
| Web framework | Express 4.x | Minimal, well-understood routing layer |
| Database | SQLite via `better-sqlite3` | Synchronous API, file-backed, zero-config |
| Cache | Redis | Optional in the FastAPI store service |
| Python stack | FastAPI + Uvicorn + pytest | Used by the sample store service |
| Tests | pytest, node:test | Cover happy path and failure cases |

## API Endpoints

### Notes

| Method | Path | Description | Success |
| --- | --- | --- | --- |
| `GET` | `/api/notes` | List all notes, newest first | `200` — array of notes |
| `POST` | `/api/notes` | Create a note from `{ title, body }` | `201` — the created note |
| `DELETE` | `/api/notes/:id` | Delete a note by id | `200` — `{ "message": "Note deleted successfully" }` |

**Example response**

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

### Messages

| Method | Path | Description | Success |
| --- | --- | --- | --- |
| `POST` | `/api/messages` | Create a message from `{ content, sender }` | `201` — the created message |
| `GET` | `/api/messages` | List all messages, newest first | `200` — array of messages |
| `GET` | `/api/messages/:id` | Fetch a single message | `200` — the message |
| `PUT` | `/api/messages/:id` | Update `content` / `sender` (partial) | `200` — the updated message |
| `DELETE` | `/api/messages/:id` | Delete a message | `200` — `{ "message": "Message deleted successfully" }` |

**Validation rules**

- `POST /api/messages` returns `400` when `content` or `sender` is missing.
- `PUT /api/messages/:id` returns `404` when the id does not exist, and
  keeps the previous value for any field that is omitted.
- `GET` / `PUT` / `DELETE` on an unknown id return `404`.

### Sample Store (FastAPI)

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/products` | List the sample product catalog |
| `GET` | `/api/products/{id}` | Fetch a single product |

Product responses include a `lastUpdated` field so clients can tell when a
cached entry went stale.

### Quiz

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/quiz/score` | Score a set of submitted answers |

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

Tables are created with `CREATE TABLE IF NOT EXISTS` at startup, so booting the
server against an existing database file is non-destructive.

## Installation

**Node services**

```bash
npm install
```

**Python services**

```bash
pip install -r requirements.txt
```

## Usage

Start the Node server:

```bash
npm start
```

Start the FastAPI store service:

```bash
uvicorn app.main:app --port 8000
```

Then exercise the API:

```bash
# Create a note
curl -X POST http://localhost:3000/api/notes \
  -H 'Content-Type: application/json' \
  -d '{"title":"My Note","body":"Note content"}'

# List notes
curl http://localhost:3000/api/notes

# Delete a note
curl -X DELETE http://localhost:3000/api/notes/1
```

## Testing

Run the Python test suite (passes even when Redis is not running, since the
cache fails open):

```bash
pytest
```

## Project Structure

```
api_db/
├── app/                  # FastAPI application package
│   ├── main.py           # App factory, routes, CORS
│   ├── data.py           # In-memory sample product data
│   └── cache.py          # Optional Redis cache wrapper
├── tests/                # Test suites
│   └── test_products.py
├── server.js             # Express entry point (Node services)
├── database.js           # SQLite connection + schema bootstrap
├── package.json          # Node dependencies and scripts
├── requirements.txt      # Python dependencies
└── readme1.md            # This document
```

## Conventions

- **All API routes live under `/api`** — no business logic on the root path.
- **Errors are JSON** with an `error` key, never HTML error pages.
- **SQL is always parameterised** (`stmt.run(...)`) — no string interpolation
  of user input into queries.
- **Unknown ids return `404`**, missing fields return `400`, unexpected
  failures return `500`.

## Contributing

1. Create a feature branch from `main`.
2. Make focused commits with clear messages.
3. Update the relevant section of this document if you change the API contract.
4. Open a pull request describing the motivation and the changes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for
details.
