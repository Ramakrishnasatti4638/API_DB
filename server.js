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

// Checkout API endpoints
let cartSession = {
  items: [
    { id: 1, name: 'Wireless Headphones', price: 79.99, quantity: 1 },
    { id: 2, name: 'USB-C Cable', price: 12.99, quantity: 2 }
  ]
};

app.get('/api/cart', (req, res) => {
  try {
    const subtotal = cartSession.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.json({
      items: cartSession.items,
      subtotal: parseFloat(subtotal.toFixed(2))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/cart/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    const item = cartSession.items.find(i => i.id === parseInt(id));
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    item.quantity = parseInt(quantity);
    const subtotal = cartSession.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({
      items: cartSession.items,
      subtotal: parseFloat(subtotal.toFixed(2))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/shipping', (req, res) => {
  try {
    const { name, address, city, zip } = req.body;
    
    if (!name || !address || !city || !zip) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    cartSession.shipping = { name, address, city, zip };
    res.json({ message: 'Shipping information saved', shipping: cartSession.shipping });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/order', (req, res) => {
  try {
    if (!cartSession.shipping) {
      return res.status(400).json({ error: 'Shipping information required' });
    }
    
    const orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const subtotal = cartSession.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const order = {
      orderNumber,
      items: cartSession.items,
      shipping: cartSession.shipping,
      subtotal: parseFloat(subtotal.toFixed(2)),
      timestamp: new Date().toISOString()
    };
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
