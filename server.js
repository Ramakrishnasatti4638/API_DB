const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const linksStore = new Map();

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function generateShortCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

app.post('/api/shorten', (req, res) => {
  const { url, customAlias } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  let shortCode = customAlias;
  
  if (customAlias) {
    if (linksStore.has(customAlias)) {
      return res.status(409).json({ error: 'Custom alias already exists' });
    }
  } else {
    do {
      shortCode = generateShortCode();
    } while (linksStore.has(shortCode));
  }

  const linkData = {
    shortCode,
    originalUrl: url,
    createdAt: new Date().toISOString(),
    clickCount: 0
  };

  linksStore.set(shortCode, linkData);

  res.status(201).json({
    shortCode,
    originalUrl: url,
    shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
    createdAt: linkData.createdAt
  });
});

app.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;

  if (shortCode === 'api') {
    return res.status(404).json({ error: 'Not found' });
  }

  const link = linksStore.get(shortCode);

  if (!link) {
    return res.status(404).json({ error: 'Short link not found' });
  }

  link.clickCount++;
  
  res.redirect(302, link.originalUrl);
});

app.get('/api/links', (req, res) => {
  const links = Array.from(linksStore.values()).sort((a, b) => b.clickCount - a.clickCount);
  
  res.json({
    links,
    stats: {
      totalLinks: links.length,
      totalClicks: links.reduce((sum, link) => sum + link.clickCount, 0)
    }
  });
});

app.delete('/api/links/:shortCode', (req, res) => {
  const { shortCode } = req.params;

  if (!linksStore.has(shortCode)) {
    return res.status(404).json({ error: 'Short link not found' });
  }

  linksStore.delete(shortCode);
  res.status(204).send();
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`URL Shortener API running on port ${PORT}`);
  });
}

module.exports = app;
module.exports.linksStore = linksStore;
