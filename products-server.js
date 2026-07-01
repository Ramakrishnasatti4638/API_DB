const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const products = [
  { id: 1, name: 'Wireless Headphones', price: 79.99 },
  { id: 2, name: 'Smart Watch', price: 199.99 },
  { id: 3, name: 'Laptop Stand', price: 34.99 },
  { id: 4, name: 'Mechanical Keyboard', price: 129.99 },
  { id: 5, name: 'USB-C Hub', price: 49.99 },
  { id: 6, name: 'Webcam HD', price: 89.99 }
];

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Products API running on http://localhost:${PORT}`);
});
