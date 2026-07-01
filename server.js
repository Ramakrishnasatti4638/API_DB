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

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    sender TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT,
    description TEXT
  )
`);

const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (productCount.count === 0) {
  const insertProduct = db.prepare('INSERT INTO products (name, price, image, description) VALUES (?, ?, ?, ?)');
  insertProduct.run('Wireless Headphones', 79.99, '🎧', 'Premium sound quality with noise cancellation');
  insertProduct.run('Smart Watch', 199.99, '⌚', 'Track your fitness and stay connected');
  insertProduct.run('Laptop Stand', 49.99, '💻', 'Ergonomic aluminum laptop stand');
  insertProduct.run('USB-C Hub', 34.99, '🔌', '7-in-1 multiport adapter');
  insertProduct.run('Mechanical Keyboard', 129.99, '⌨️', 'RGB backlit gaming keyboard');
  insertProduct.run('Wireless Mouse', 39.99, '🖱️', 'Precision optical tracking');
}

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

// Message CRUD endpoints

// CREATE - Create a new message
app.post('/api/messages', (req, res) => {
  try {
    const { content, sender } = req.body;
    
    if (!content || !sender) {
      return res.status(400).json({ error: 'Content and sender are required' });
    }
    
    const insert = db.prepare('INSERT INTO messages (content, sender) VALUES (?, ?)');
    const result = insert.run(content, sender);
    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get all messages
app.get('/api/messages', (req, res) => {
  try {
    const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get a single message by ID
app.get('/api/messages/:id', (req, res) => {
  try {
    const { id } = req.params;
    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Update a message
app.put('/api/messages/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { content, sender } = req.body;
    
    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    const update = db.prepare(
      'UPDATE messages SET content = ?, sender = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    );
    update.run(content || message.content, sender || message.sender, id);
    
    const updatedMessage = db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete a message
app.delete('/api/messages/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleteStmt = db.prepare('DELETE FROM messages WHERE id = ?');
    const result = deleteStmt.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Product endpoints
app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
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
