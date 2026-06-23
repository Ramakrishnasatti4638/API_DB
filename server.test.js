const request = require('supertest');
const { app, db, server } = require('./server');

describe('Job Board API', () => {
  afterAll(() => {
    db.close();
    server.close();
  });

  describe('GET /api/jobs', () => {
    it('should return all jobs', async () => {
      const response = await request(app).get('/api/jobs');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should filter jobs by type=full-time', async () => {
      const response = await request(app).get('/api/jobs?type=full-time');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(job => {
        expect(job.type).toBe('full-time');
      });
    });

    it('should filter jobs by type=remote', async () => {
      const response = await request(app).get('/api/jobs?type=remote');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(job => {
        expect(job.type).toBe('remote');
      });
    });

    it('should filter jobs by type=part-time', async () => {
      const response = await request(app).get('/api/jobs?type=part-time');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(job => {
        expect(job.type).toBe('part-time');
      });
    });
  });

  describe('POST /api/jobs', () => {
    it('should create a new job', async () => {
      const newJob = {
        title: 'Test Engineer',
        company: 'Test Company',
        location: 'Test Location',
        type: 'full-time',
        salary: '$80k - $100k'
      };

      const response = await request(app)
        .post('/api/jobs')
        .send(newJob);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(newJob);
      expect(response.body.id).toBeDefined();
      expect(response.body.posted_at).toBeDefined();
    });

    it('should return job with all required fields', async () => {
      const newJob = {
        title: 'Software Engineer',
        company: 'Acme Corp',
        location: 'Boston, MA',
        type: 'remote',
        salary: '$110k - $150k'
      };

      const response = await request(app)
        .post('/api/jobs')
        .send(newJob);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('company');
      expect(response.body).toHaveProperty('location');
      expect(response.body).toHaveProperty('type');
      expect(response.body).toHaveProperty('salary');
      expect(response.body).toHaveProperty('posted_at');
    });
  });

  describe('DELETE /api/jobs/:id', () => {
    it('should delete a job', async () => {
      // First create a job
      const newJob = {
        title: 'Job to Delete',
        company: 'Delete Co',
        location: 'Nowhere',
        type: 'full-time',
        salary: '$1'
      };

      const createResponse = await request(app)
        .post('/api/jobs')
        .send(newJob);

      const jobId = createResponse.body.id;

      // Then delete it
      const deleteResponse = await request(app)
        .delete(`/api/jobs/${jobId}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toHaveProperty('message');
    });

    it('should return 404 for non-existent job', async () => {
      const response = await request(app)
        .delete('/api/jobs/999999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});
