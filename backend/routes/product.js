const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.post('/', async (req, res) => {
  const { productName, isUrgent } = req.body;
  
  const newProduct = new Product({
    name: productName,
    isUrgent: isUrgent
  });

  const savedProduct = await newProduct.save();
  res.json(savedProduct);
});



router.get('/getproducts', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

module.exports = router;