# Notes & Todo API Backend

Express.js REST API with SQLite database (better-sqlite3) for note-taking and todo management.

## Features

- **SQLite Database**: Persistent storage using better-sqlite3
- **RESTful API**: Clean API endpoints for notes, messages, and todos
- **CORS Enabled**: Works with frontend on different port
- **Todo App UI**: Full-featured todo application with priority levels, filtering, and statistics

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

## Todo API Endpoints

### Database Schema
```sql
todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT 0,
  priority TEXT DEFAULT 'medium',
  due_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### GET /api/todos
Get all todos with optional filtering

**Query Parameters:**
- `status`: Filter by completion status (`active`, `completed`)
- `priority`: Filter by priority level (`low`, `medium`, `high`)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the todo app feature",
    "completed": 0,
    "priority": "high",
    "due_date": "2024-12-31",
    "created_at": "2026-07-06 03:57:38",
    "updated_at": "2026-07-06 03:57:38"
  }
]
```

### GET /api/todos/:id
Get a single todo by ID

### POST /api/todos
Create a new todo

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "low",
  "due_date": "2024-12-25"
}
```

### PUT /api/todos/:id
Update a todo (all fields optional)

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "high",
  "completed": 1
}
```

### PATCH /api/todos/:id/toggle
Toggle todo completion status

### DELETE /api/todos/:id
Delete a specific todo

### DELETE /api/todos/completed/clear
Clear all completed todos

## Todo App UI

Access the full-featured todo application at: `http://localhost:3000/todo.html`

**Features:**
- ✅ Create, read, update, and delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Priority levels (high, medium, low) with color coding
- ✅ Optional due dates
- ✅ Filter by status (all, active, completed)
- ✅ Filter by priority level
- ✅ Clear all completed todos
- ✅ Real-time statistics
- ✅ Modern, responsive design

## Data Persistence

Notes, messages, and todos are stored in `notes.db` SQLite database file. Data persists across server restarts.
