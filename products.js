const express = require('express');
const router = express.Router();

// Sample products data
const products = [
  { id: 1, name: 'Wireless Headphones', price: 79.99 },
  { id: 2, name: 'Smart Watch', price: 199.99 },
  { id: 3, name: 'Laptop Stand', price: 49.99 },
  { id: 4, name: 'USB-C Hub', price: 39.99 },
  { id: 5, name: 'Mechanical Keyboard', price: 129.99 },
  { id: 6, name: 'Wireless Mouse', price: 59.99 }
];

// Get all products
router.get('/products', (req, res) => {
  res.json(products);
});

// Get single product
router.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

module.exports = router;
