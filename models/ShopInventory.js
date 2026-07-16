const mongoose = require("mongoose");

const ShopInventorySchema = new mongoose.Schema({
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    itemName: { type: String, required: true, trim: true },
    category: { type: String, default: "" },
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    sold: { type: Number, default: 0 }
}, { timestamps: true });

ShopInventorySchema.index({ shop: 1, itemName: 1 }, { unique: true });

module.exports = mongoose.model("ShopInventory", ShopInventorySchema);
