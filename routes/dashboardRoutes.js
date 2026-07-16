const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controllers/shopController");
router.get("/", getDashboard);
module.exports = router;
