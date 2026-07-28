const request = require('supertest');
const { app, server } = require('./server');

afterAll((done) => {
  server.close(done);
});

describe('URL Shortener API', () => {
  describe('POST /api/shorten', () => {
    it('should create a shortened URL with auto-generated code', async () => {
      const response = await request(app)
        .post('/api/shorten')
        .send({ url: 'https://example.com' })
        .expect(201);

      expect(response.body).toHaveProperty('shortCode');
      expect(response.body).toHaveProperty('originalUrl', 'https://example.com');
      expect(response.body).toHaveProperty('shortUrl');
      expect(response.body.shortCode).toHaveLength(6);
    });

    it('should create a shortened URL with custom alias', async () => {
      const response = await request(app)
        .post('/api/shorten')
        .send({ url: 'https://google.com', customAlias: 'google' })
        .expect(201);

      expect(response.body.shortCode).toBe('google');
      expect(response.body.originalUrl).toBe('https://google.com');
    });

    it('should return 409 if custom alias already exists', async () => {
      await request(app)
        .post('/api/shorten')
        .send({ url: 'https://first.com', customAlias: 'taken' });

      const response = await request(app)
        .post('/api/shorten')
        .send({ url: 'https://second.com', customAlias: 'taken' })
        .expect(409);

      expect(response.body.error).toBe('Alias already taken');
    });

    it('should return 400 if URL is missing', async () => {
      const response = await request(app)
        .post('/api/shorten')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('URL is required');
    });

    it('should return 400 if URL format is invalid', async () => {
      const response = await request(app)
        .post('/api/shorten')
        .send({ url: 'not-a-valid-url' })
        .expect(400);

      expect(response.body.error).toBe('Invalid URL format');
    });

    it('should accept http:// URLs', async () => {
      const response = await request(app)
        .post('/api/shorten')
        .send({ url: 'http://example.com' })
        .expect(201);

      expect(response.body.originalUrl).toBe('http://example.com');
    });

    it('should reject ftp:// URLs', async () => {
      const response = await request(app)
        .post('/api/shorten')
        .send({ url: 'ftp://example.com' })
        .expect(400);

      expect(response.body.error).toBe('Invalid URL format');
    });
  });

  describe('GET /:shortCode', () => {
    it('should redirect to original URL', async () => {
      const createResponse = await request(app)
        .post('/api/shorten')
        .send({ url: 'https://redirect-test.com', customAlias: 'redir' });

      const response = await request(app)
        .get('/redir')
        .expect(302);

      expect(response.headers.location).toBe('https://redirect-test.com');
    });

    it('should increment click count on redirect', async () => {
      await request(app)
        .post('/api/shorten')
        .send({ url: 'https://click-test.com', customAlias: 'clicks' });

      await request(app).get('/clicks');
      await request(app).get('/clicks');
      await request(app).get('/clicks');

      const linksResponse = await request(app).get('/api/links');
      const link = linksResponse.body.find(l => l.shortCode === 'clicks');
      expect(link.clickCount).toBe(3);
    });

    it('should return 404 for unknown short code', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);

      expect(response.text).toContain('not found');
    });
  });

  describe('GET /api/links', () => {
    it('should return all links sorted by click count', async () => {
      await request(app)
        .post('/api/shorten')
        .send({ url: 'https://low-clicks.com', customAlias: 'low' });

      await request(app)
        .post('/api/shorten')
        .send({ url: 'https://high-clicks.com', customAlias: 'high' });

      await request(app).get('/low');
      await request(app).get('/high');
      await request(app).get('/high');
      await request(app).get('/high');

      const response = await request(app)
        .get('/api/links')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const highLink = response.body.find(l => l.shortCode === 'high');
      const lowLink = response.body.find(l => l.shortCode === 'low');
      
      expect(highLink.clickCount).toBe(3);
      expect(lowLink.clickCount).toBe(1);
      
      const highIndex = response.body.indexOf(highLink);
      const lowIndex = response.body.indexOf(lowLink);
      expect(highIndex).toBeLessThan(lowIndex);
    });

    it('should include all link properties', async () => {
      await request(app)
        .post('/api/shorten')
        .send({ url: 'https://props-test.com', customAlias: 'props' });

      const response = await request(app).get('/api/links');
      const link = response.body.find(l => l.shortCode === 'props');

      expect(link).toHaveProperty('shortCode');
      expect(link).toHaveProperty('originalUrl');
      expect(link).toHaveProperty('createdAt');
      expect(link).toHaveProperty('clickCount');
    });
  });

  describe('DELETE /api/links/:shortCode', () => {
    it('should delete an existing link', async () => {
      await request(app)
        .post('/api/shorten')
        .send({ url: 'https://delete-test.com', customAlias: 'delme' });

      await request(app)
        .delete('/api/links/delme')
        .expect(204);

      const response = await request(app)
        .get('/delme')
        .expect(404);
    });

    it('should return 404 when deleting non-existent link', async () => {
      const response = await request(app)
        .delete('/api/links/doesnotexist')
        .expect(404);

      expect(response.body.error).toBe('Short code not found');
    });
  });
});
