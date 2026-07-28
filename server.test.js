const request = require('supertest');
const app = require('./server');

describe('URL Shortener API', () => {
  let testShortCode;

  beforeEach(() => {
    app.linksStore.clear();
  });

  describe('POST /api/shorten', () => {
    it('should create a short URL with auto-generated code', async () => {
      const res = await request(app)
        .post('/api/shorten')
        .send({ url: 'https://example.com' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('shortCode');
      expect(res.body.shortCode).toHaveLength(6);
      expect(res.body.originalUrl).toBe('https://example.com');
      expect(res.body).toHaveProperty('shortUrl');
      expect(res.body).toHaveProperty('createdAt');
      
      testShortCode = res.body.shortCode;
    });

    it('should create a short URL with custom alias', async () => {
      const res = await request(app)
        .post('/api/shorten')
        .send({ url: 'https://google.com', customAlias: 'myalias' });

      expect(res.status).toBe(201);
      expect(res.body.shortCode).toBe('myalias');
      expect(res.body.originalUrl).toBe('https://google.com');
    });

    it('should return 409 if custom alias already exists', async () => {
      await request(app)
        .post('/api/shorten')
        .send({ url: 'https://test1.com', customAlias: 'duplicate' });

      const res = await request(app)
        .post('/api/shorten')
        .send({ url: 'https://test2.com', customAlias: 'duplicate' });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe('Custom alias already exists');
    });

    it('should return 400 for missing URL', async () => {
      const res = await request(app)
        .post('/api/shorten')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('URL is required');
    });

    it('should return 400 for invalid URL format', async () => {
      const res = await request(app)
        .post('/api/shorten')
        .send({ url: 'not-a-valid-url' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid URL format');
    });

    it('should accept HTTP and HTTPS URLs', async () => {
      const httpRes = await request(app)
        .post('/api/shorten')
        .send({ url: 'http://example.com' });
      
      const httpsRes = await request(app)
        .post('/api/shorten')
        .send({ url: 'https://example.com' });

      expect(httpRes.status).toBe(201);
      expect(httpsRes.status).toBe(201);
    });
  });

  describe('GET /:shortCode', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/shorten')
        .send({ url: 'https://redirect-test.com', customAlias: 'redirect123' });
      testShortCode = res.body.shortCode;
    });

    it('should redirect to original URL', async () => {
      const res = await request(app)
        .get('/redirect123')
        .redirects(0);

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('https://redirect-test.com');
    });

    it('should increment click count', async () => {
      await request(app).get('/redirect123').redirects(0);
      await request(app).get('/redirect123').redirects(0);
      await request(app).get('/redirect123').redirects(0);

      const res = await request(app).get('/api/links');
      const link = res.body.links.find(l => l.shortCode === 'redirect123');
      
      expect(link.clickCount).toBe(3);
    });

    it('should return 404 for unknown short code', async () => {
      const res = await request(app)
        .get('/nonexistent')
        .redirects(0);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Short link not found');
    });
  });

  describe('GET /api/links', () => {
    beforeEach(async () => {
      await request(app).post('/api/shorten').send({ url: 'https://link1.com', customAlias: 'link1' });
      await request(app).post('/api/shorten').send({ url: 'https://link2.com', customAlias: 'link2' });
      await request(app).post('/api/shorten').send({ url: 'https://link3.com', customAlias: 'link3' });
      
      await request(app).get('/link1').redirects(0);
      await request(app).get('/link1').redirects(0);
      await request(app).get('/link1').redirects(0);
      await request(app).get('/link2').redirects(0);
    });

    it('should return all links with stats', async () => {
      const res = await request(app).get('/api/links');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('links');
      expect(res.body).toHaveProperty('stats');
      expect(Array.isArray(res.body.links)).toBe(true);
      expect(res.body.links.length).toBeGreaterThanOrEqual(3);
    });

    it('should sort links by click count descending', async () => {
      const res = await request(app).get('/api/links');

      const link1 = res.body.links.find(l => l.shortCode === 'link1');
      const link2 = res.body.links.find(l => l.shortCode === 'link2');
      const link3 = res.body.links.find(l => l.shortCode === 'link3');

      expect(link1.clickCount).toBe(3);
      expect(link2.clickCount).toBe(1);
      expect(link3.clickCount).toBe(0);

      const link1Index = res.body.links.indexOf(link1);
      const link2Index = res.body.links.indexOf(link2);
      const link3Index = res.body.links.indexOf(link3);

      expect(link1Index).toBeLessThan(link2Index);
      expect(link2Index).toBeLessThan(link3Index);
    });

    it('should return correct stats', async () => {
      const res = await request(app).get('/api/links');

      expect(res.body.stats.totalLinks).toBeGreaterThanOrEqual(3);
      expect(res.body.stats.totalClicks).toBeGreaterThanOrEqual(4);
    });
  });

  describe('DELETE /api/links/:shortCode', () => {
    beforeEach(async () => {
      await request(app).post('/api/shorten').send({ url: 'https://delete-test.com', customAlias: 'todelete' });
    });

    it('should delete a short link', async () => {
      const res = await request(app).delete('/api/links/todelete');

      expect(res.status).toBe(204);

      const getRes = await request(app).get('/todelete').redirects(0);
      expect(getRes.status).toBe(404);
    });

    it('should return 404 for non-existent short code', async () => {
      const res = await request(app).delete('/api/links/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Short link not found');
    });
  });
});
