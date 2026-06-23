const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = new Database(path.join(__dirname, 'jobs.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    salary TEXT NOT NULL,
    posted_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Seed with 8 jobs if table is empty
const count = db.prepare('SELECT COUNT(*) as count FROM jobs').get();
if (count.count === 0) {
  const insert = db.prepare('INSERT INTO jobs (title, company, location, type, salary) VALUES (?, ?, ?, ?, ?)');
  
  const seedJobs = [
    ['Senior Frontend Developer', 'TechCorp', 'San Francisco, CA', 'full-time', '$120k - $160k'],
    ['Backend Engineer', 'StartupXYZ', 'Remote', 'remote', '$100k - $140k'],
    ['Product Designer', 'DesignHub', 'New York, NY', 'full-time', '$90k - $130k'],
    ['DevOps Engineer', 'CloudSystems', 'Austin, TX', 'full-time', '$110k - $150k'],
    ['Part-Time Developer', 'FreelanceCo', 'Remote', 'part-time', '$50/hour'],
    ['Full Stack Developer', 'WebAgency', 'Seattle, WA', 'full-time', '$105k - $145k'],
    ['Mobile Developer', 'AppBuilders', 'Remote', 'remote', '$95k - $135k'],
    ['UI/UX Designer', 'CreativeStudio', 'Los Angeles, CA', 'part-time', '$45/hour']
  ];
  
  seedJobs.forEach(job => insert.run(...job));
  console.log('Database seeded with 8 jobs');
}

app.get('/api/jobs', (req, res) => {
  try {
    const { type } = req.query;
    let jobs;
    
    if (type) {
      jobs = db.prepare('SELECT * FROM jobs WHERE type = ? ORDER BY posted_at DESC').all(type);
    } else {
      jobs = db.prepare('SELECT * FROM jobs ORDER BY posted_at DESC').all();
    }
    
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/jobs', (req, res) => {
  try {
    const { title, company, location, type, salary } = req.body;
    const insert = db.prepare('INSERT INTO jobs (title, company, location, type, salary) VALUES (?, ?, ?, ?, ?)');
    const result = insert.run(title, company, location, type, salary);
    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/jobs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleteStmt = db.prepare('DELETE FROM jobs WHERE id = ?');
    const result = deleteStmt.run(id);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Job not found' });
    } else {
      res.json({ message: 'Job deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

module.exports = { app, db, server };
