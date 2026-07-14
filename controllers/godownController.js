const Godown = require("../models/Godown");
const Product = require("../models/Product");

exports.addGodownStock = async(req,res)=>{

    const {itemName, quantity} = req.body;

    if(!itemName || !Number.isInteger(quantity) || quantity <= 0)
        return res.status(400).json({
            message:"Enter a product name and a whole quantity greater than zero"
        });

    const product = await Product.findOne({itemName: itemName.trim()});

    if(!product)
        return res.status(404).json({
            message:"Add this product to the shop inventory before adding godown stock"
        });

    const stock = await Godown.findOneAndUpdate(
        {itemName: itemName.trim()},
        {$inc: {quantity}},
        {new:true, upsert:true, setDefaultsOnInsert:true}
    );

    res.json(stock);

}

exports.getGodown = async(req,res)=>{

    const stock = await Godown.find();

    res.json(stock);

}

exports.transferStock = async(req,res)=>{

    const {itemName,quantity}=req.body;

    if(!itemName || !Number.isInteger(quantity) || quantity <= 0)
        return res.status(400).json({
            message:"Enter a product name and a whole quantity greater than zero"
        });

    const godown = await Godown.findOne({itemName});

    const product = await Product.findOne({itemName});

    if(!godown)

        return res.status(404).json({
            message:"No Item"
        });

    if(!product)

        return res.status(404).json({
            message:"This item does not exist in the shop inventory"
        });

    if(godown.quantity<quantity)

        return res.status(400).json({
            message:"Not Enough Stock"
        });

    godown.quantity -= quantity;

    product.shopStock += quantity;

    await godown.save();

    await product.save();

    res.json({
        message:"Transferred Successfully"
    });

}
