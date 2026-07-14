const Product = require("../models/Product");

exports.addProduct = async(req,res)=>{

    const product = await Product.create(req.body);

    res.json(product);

}
exports.getProducts = async(req,res)=>{

    const products = await Product.find();

    res.json(products);

}

exports.updateStock = async(req,res)=>{

    const {shopStock} = req.body;

    const product = await Product.findByIdAndUpdate(

        req.params.id,

        {shopStock},

        {new:true}

    );

    res.json(product);

}
exports.deleteProduct = async(req,res)=>{

    await Product.findByIdAndDelete(req.params.id);

    res.json({
        message:"Deleted"
    });

}

exports.sellProduct = async(req,res)=>{

    const product = await Product.findById(req.params.id);

    if(product.shopStock<=0){

        return res.json({
            message:"Out of Stock"
        });

    }

    product.shopStock--;

    await product.save();

    res.json(product);

}
