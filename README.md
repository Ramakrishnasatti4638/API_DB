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

## Products & Cart API

In addition to the notes and messages APIs, the server exposes a small product
catalog and a server-side cart.

### GET /api/products
Returns the list of 6 seeded products.

```json
[
  { "id": 1, "name": "Wireless Headphones", "price": 79.99, "image": "🎧", "description": "..." }
]
```

### GET /api/products/:id
Returns a single product.

### GET /api/cart
Returns `{ items, total, itemCount }`.

### POST /api/cart
Body: `{ "productId": 1, "quantity": 1 }`. Adds (or increments) a cart line.

### PUT /api/cart/:productId
Body: `{ "quantity": 3 }`. Sets the quantity. A quantity of `0` removes the line.

### DELETE /api/cart/:productId
Removes a single line from the cart.

### DELETE /api/cart
Clears the cart.
