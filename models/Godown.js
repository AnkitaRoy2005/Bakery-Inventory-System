const mongoose = require("mongoose");

const GodownSchema = new mongoose.Schema({

    itemName:String,

    quantity:Number

});

module.exports = mongoose.model("Godown",GodownSchema);