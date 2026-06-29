const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new Database(path.join(__dirname, 'notes.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.get('/api/notes', (req, res) => {
  try {
    const notes = db.prepare('SELECT * FROM notes ORDER BY created_at DESC').all();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/notes', (req, res) => {
  try {
    const { title, body } = req.body;
    const insert = db.prepare('INSERT INTO notes (title, body) VALUES (?, ?)');
    const result = insert.run(title || 'Untitled', body || '');
    const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/notes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleteStmt = db.prepare('DELETE FROM notes WHERE id = ?');
    const result = deleteStmt.run(id);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Note not found' });
    } else {
      res.json({ message: 'Note deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Messages endpoint
app.get('/messages', (req, res) => {
  try {
    const messages = [
      { id: 1, text: 'Hello from the backend!', timestamp: '2024-01-15T10:30:00Z' },
      { id: 2, text: 'This is message number two', timestamp: '2024-01-15T11:45:00Z' },
      { id: 3, text: 'Node.js + Express is awesome', timestamp: '2024-01-15T14:20:00Z' },
      { id: 4, text: 'Building full-stack apps is fun!', timestamp: '2024-01-15T16:00:00Z' }
    ];
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Quiz scoring endpoint
const ANSWER_KEY = ['A', 'B', 'C', 'A', 'D'];

app.post('/submit', (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers must be an array' });
    }
    
    let score = 0;
    const total = ANSWER_KEY.length;
    
    for (let i = 0; i < ANSWER_KEY.length; i++) {
      if (answers[i] === ANSWER_KEY[i]) {
        score++;
      }
    }
    
    res.json({ score, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
