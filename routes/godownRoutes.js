const express = require("express");
const router = express.Router();
const godownController = require("../controllers/godownController");

// Add stock to godown
router.post("/add", godownController.addGodownStock);

// View godown inventory
router.get("/", godownController.getGodown);

// Transfer stock from godown to shop
router.post("/transfer", godownController.transferStock);

module.exports = router;