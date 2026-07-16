const express = require("express");
const router = express.Router();
const shop = require("../controllers/shopController");

router.get("/", shop.getShops);
router.post("/", shop.addShop);
router.get("/:shopId/inventory", shop.getShopInventory);
router.post("/allocate", shop.allocateStock);
router.post("/inventory/:inventoryId/sell", shop.sellFromShop);

module.exports = router;
