const request = require('supertest');
const { app, db, server } = require('./jobs-server');

describe('Jobs API', () => {
  afterAll(() => {
    db.close();
    server.close();
  });

  describe('GET /api/jobs', () => {
    it('should return all jobs', async () => {
      const res = await request(app).get('/api/jobs');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should filter jobs by type', async () => {
      const res = await request(app).get('/api/jobs?type=remote');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach(job => {
        expect(job.type).toBe('remote');
      });
    });

    it('should return empty array for non-existent type', async () => {
      const res = await request(app).get('/api/jobs?type=nonexistent');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  describe('POST /api/jobs', () => {
    it('should create a new job', async () => {
      const newJob = {
        title: 'Test Engineer',
        company: 'Test Company',
        location: 'Test City',
        type: 'full-time',
        salary: '$80k - $100k'
      };

      const res = await request(app)
        .post('/api/jobs')
        .send(newJob);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe(newJob.title);
      expect(res.body.company).toBe(newJob.company);
      expect(res.body.location).toBe(newJob.location);
      expect(res.body.type).toBe(newJob.type);
      expect(res.body.salary).toBe(newJob.salary);
    });

    it('should return 400 if required fields are missing', async () => {
      const incompleteJob = {
        title: 'Test Engineer',
        company: 'Test Company'
      };

      const res = await request(app)
        .post('/api/jobs')
        .send(incompleteJob);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/jobs/:id', () => {
    it('should delete an existing job', async () => {
      // First create a job
      const newJob = {
        title: 'Job to Delete',
        company: 'Delete Company',
        location: 'Delete City',
        type: 'remote',
        salary: '$50k - $70k'
      };

      const createRes = await request(app)
        .post('/api/jobs')
        .send(newJob);

      const jobId = createRes.body.id;

      // Then delete it
      const deleteRes = await request(app).delete(`/api/jobs/${jobId}`);
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.message).toBe('Job deleted successfully');

      // Verify it's deleted
      const getRes = await request(app).get('/api/jobs');
      const deletedJob = getRes.body.find(job => job.id === jobId);
      expect(deletedJob).toBeUndefined();
    });

    it('should return 404 for non-existent job', async () => {
      const res = await request(app).delete('/api/jobs/99999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});
