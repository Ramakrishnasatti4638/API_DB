const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

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
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT 0,
    priority TEXT DEFAULT 'medium',
    due_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

// TODO CRUD endpoints

// CREATE - Create a new todo
app.post('/api/todos', (req, res) => {
  try {
    const { title, description, priority, due_date } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const insert = db.prepare(
      'INSERT INTO todos (title, description, priority, due_date) VALUES (?, ?, ?, ?)'
    );
    const result = insert.run(
      title,
      description || null,
      priority || 'medium',
      due_date || null
    );
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get all todos
app.get('/api/todos', (req, res) => {
  try {
    const { status, priority } = req.query;
    let query = 'SELECT * FROM todos';
    const conditions = [];
    const params = [];
    
    if (status === 'active') {
      conditions.push('completed = 0');
    } else if (status === 'completed') {
      conditions.push('completed = 1');
    }
    
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      conditions.push('priority = ?');
      params.push(priority);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC';
    
    const todos = db.prepare(query).all(...params);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get a single todo by ID
app.get('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Update a todo
app.put('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, due_date, completed } = req.body;
    
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    const update = db.prepare(
      'UPDATE todos SET title = ?, description = ?, priority = ?, due_date = ?, completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    );
    update.run(
      title !== undefined ? title : todo.title,
      description !== undefined ? description : todo.description,
      priority !== undefined ? priority : todo.priority,
      due_date !== undefined ? due_date : todo.due_date,
      completed !== undefined ? completed : todo.completed,
      id
    );
    
    const updatedTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TOGGLE - Toggle todo completion status
app.patch('/api/todos/:id/toggle', (req, res) => {
  try {
    const { id } = req.params;
    
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    const update = db.prepare(
      'UPDATE todos SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    );
    update.run(todo.completed ? 0 : 1, id);
    
    const updatedTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleteStmt = db.prepare('DELETE FROM todos WHERE id = ?');
    const result = deleteStmt.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Clear all completed todos
app.delete('/api/todos/completed/clear', (req, res) => {
  try {
    const deleteStmt = db.prepare('DELETE FROM todos WHERE completed = 1');
    const result = deleteStmt.run();
    
    res.json({ message: `${result.changes} completed todo(s) cleared` });
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
