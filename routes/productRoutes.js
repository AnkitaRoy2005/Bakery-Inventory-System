const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Add Product
router.post("/add", productController.addProduct);

// Get All Products
router.get("/", productController.getProducts);

// Update Product Stock
router.put("/update/:id", productController.updateStock);

// Delete Product
router.delete("/delete/:id", productController.deleteProduct);

// Sell Product
router.post("/sell/:id", productController.sellProduct);

module.exports = router;