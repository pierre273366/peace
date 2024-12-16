const express = require('express');
const router = express.Router();
const Product = require('../models/product');



//ROUTE POST : CREATION D'UN PRODUIT
router.post('/', async (req, res) => {
  const { productName, isUrgent, colocToken } = req.body;
  
  if (!colocToken) {
    return res.status(400).json({ error: 'colocToken is required' });
  }

  const newProduct = new Product({
    name: productName,
    isUrgent: isUrgent,
    colocToken: colocToken,
    createdAt: new Date()
  });

  const savedProduct = await newProduct.save();
  res.json(savedProduct);
});



//ROUTE GET : RECUPERE TOUTES LA LISTE DES PRODUIT VIA UN IDCOLOC
router.get('/getproducts/:colocToken', async (req, res) => {
  const { colocToken } = req.params;
  
  if (!colocToken) {
    return res.status(400).json({ error: 'colocToken is required' });
  }

  const products = await Product.find({ colocToken })
    .sort({ createdAt: -1 });
  res.json(products);
});




//ROUTE DELETE: SUPPRIME LES PRODUITS COCHÉ
router.delete('/:productId', async (req, res) => {
  const { productId } = req.params;
  
  try {
    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
});



module.exports = router;