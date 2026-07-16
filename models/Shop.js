const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    location: { type: String, trim: true, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Shop", ShopSchema);
