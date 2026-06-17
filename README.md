# Notes API Backend

Express.js REST API with SQLite database (better-sqlite3) for a note-taking application.

## Features

- **SQLite Database**: Persistent storage using better-sqlite3
- **RESTful API**: Clean API endpoints for note management
- **CORS Enabled**: Works with frontend on different port

## Database Schema

```sql
notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## API Endpoints

### GET /api/notes
Returns all notes ordered by creation date (newest first)

**Response:**
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

### POST /api/notes
Creates a new note

**Request Body:**
```json
{
  "title": "Note Title",
  "body": "Note content"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Note Title",
  "body": "Note content",
  "created_at": "2026-06-17 06:54:34"
}
```

### DELETE /api/notes/:id
Deletes a note by ID

**Response:**
```json
{
  "message": "Note deleted successfully"
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

Server runs on `http://localhost:3001`

## Dependencies

- express: Web framework
- better-sqlite3: SQLite database driver
- cors: Enable CORS for frontend communication

## Data Persistence

Notes are stored in `notes.db` SQLite database file. Data persists across server restarts.
