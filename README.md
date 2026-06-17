# Notes API

A simple RESTful API for managing notes built with Express.js and SQLite (better-sqlite3).

## Features

- **GET /api/notes** - Retrieve all notes (ordered by creation date, newest first)
- **POST /api/notes** - Create a new note
- **PUT /api/notes/:id** - Update an existing note
- **DELETE /api/notes/:id** - Delete a note

## Database Schema

```sql
CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The API will be running at `http://localhost:3001`

## Usage Examples

### Get all notes
```bash
curl http://localhost:3001/api/notes
```

### Create a note
```bash
curl -X POST http://localhost:3001/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"My Note","body":"Note content here"}'
```

### Update a note
```bash
curl -X PUT http://localhost:3001/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","body":"Updated content"}'
```

### Delete a note
```bash
curl -X DELETE http://localhost:3001/api/notes/1
```

## Technologies

- **Express.js** - Web framework
- **better-sqlite3** - Fast SQLite database driver
- **CORS** - Enable cross-origin requests
