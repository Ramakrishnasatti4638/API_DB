import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';

const app = express();
const db = new Database('notes.db');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// GET /api/notes - Get all notes
app.get('/api/notes', (req, res) => {
  const notes = db.prepare('SELECT * FROM notes ORDER BY created_at DESC').all();
  res.json(notes);
});

// POST /api/notes - Create a new note
app.post('/api/notes', (req, res) => {
  const { title, body } = req.body;
  
  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required' });
  }
  
  const stmt = db.prepare('INSERT INTO notes (title, body) VALUES (?, ?)');
  const result = stmt.run(title, body);
  
  const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(note);
});

// DELETE /api/notes/:id - Delete a note
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  
  const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
  const result = stmt.run(id);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Note not found' });
  }
  
  res.status(204).send();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Notes API running on http://localhost:${PORT}`);
});
