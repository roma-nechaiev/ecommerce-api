const Product = require('../models/Product');

async function updateStock(id, qty) {
  const product = await Product.findById(id);
  product.stock -= qty;

  await product.save();
}

module.exports = updateStock;
