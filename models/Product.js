const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({

    itemName:{
        type:String,
        required:true
    },

    category:String,

    price:Number,

    shopStock:{
        type:Number,
        default:0
    }

});

module.exports = mongoose.model("Product",ProductSchema);