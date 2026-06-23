const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

const db = new Database(path.join(__dirname, 'jobs.db'));

// Create jobs table
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

// Seed with 8 jobs
const seedJobs = () => {
  const count = db.prepare('SELECT COUNT(*) as count FROM jobs').get();
  if (count.count === 0) {
    const insert = db.prepare(
      'INSERT INTO jobs (title, company, location, type, salary) VALUES (?, ?, ?, ?, ?)'
    );
    
    const jobs = [
      ['Senior Software Engineer', 'TechCorp', 'San Francisco, CA', 'full-time', '$120k - $160k'],
      ['Frontend Developer', 'StartupHub', 'New York, NY', 'full-time', '$90k - $130k'],
      ['Backend Engineer', 'CloudSystems', 'Austin, TX', 'remote', '$110k - $150k'],
      ['Full Stack Developer', 'WebSolutions', 'Seattle, WA', 'full-time', '$100k - $140k'],
      ['UI/UX Designer', 'DesignCo', 'Los Angeles, CA', 'part-time', '$60k - $80k'],
      ['DevOps Engineer', 'InfraTech', 'Boston, MA', 'remote', '$115k - $155k'],
      ['Mobile Developer', 'AppFactory', 'Chicago, IL', 'full-time', '$95k - $135k'],
      ['Product Manager', 'InnovateLabs', 'Denver, CO', 'part-time', '$70k - $90k']
    ];
    
    jobs.forEach(job => insert.run(...job));
    console.log('Database seeded with 8 jobs');
  }
};

seedJobs();

// GET /api/jobs - with optional ?type= filter
app.get('/api/jobs', (req, res) => {
  try {
    const { type } = req.query;
    let query = 'SELECT * FROM jobs ORDER BY posted_at DESC';
    let jobs;
    
    if (type) {
      query = 'SELECT * FROM jobs WHERE type = ? ORDER BY posted_at DESC';
      jobs = db.prepare(query).all(type);
    } else {
      jobs = db.prepare(query).all();
    }
    
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/jobs
app.post('/api/jobs', (req, res) => {
  try {
    const { title, company, location, type, salary } = req.body;
    
    if (!title || !company || !location || !type || !salary) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const insert = db.prepare(
      'INSERT INTO jobs (title, company, location, type, salary) VALUES (?, ?, ?, ?, ?)'
    );
    const result = insert.run(title, company, location, type, salary);
    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/jobs/:id
app.delete('/api/jobs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleteStmt = db.prepare('DELETE FROM jobs WHERE id = ?');
    const result = deleteStmt.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Jobs API server running on http://localhost:${PORT}`);
});

module.exports = { app, db, server };
