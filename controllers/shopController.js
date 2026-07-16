const Shop = require("../models/Shop");
const ShopInventory = require("../models/ShopInventory");
const Product = require("../models/Product");
const Godown = require("../models/Godown");

exports.getShops = async (req, res) => res.json(await Shop.find().sort({ createdAt: -1 }));

exports.addShop = async (req, res) => {
    const { name, location } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "Shop name is required" });
    res.status(201).json(await Shop.create({ name: name.trim(), location: (location || "").trim() }));
};

exports.getShopInventory = async (req, res) => {
    res.json(await ShopInventory.find({ shop: req.params.shopId }).sort({ itemName: 1 }));
};

exports.allocateStock = async (req, res) => {
    const { itemName, quantity, shopId } = req.body;
    if (!itemName || !shopId || !Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ message: "Choose a shop, item, and valid quantity" });
    }
    const [shop, godown, product] = await Promise.all([
        Shop.findById(shopId), Godown.findOne({ itemName: itemName.trim() }), Product.findOne({ itemName: itemName.trim() })
    ]);
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    if (!godown || godown.quantity < quantity) return res.status(400).json({ message: "Not enough godown stock" });
    if (!product) return res.status(404).json({ message: "Product not found" });
    godown.quantity -= quantity;
    await godown.save();
    const inventory = await ShopInventory.findOneAndUpdate(
        { shop: shopId, itemName: product.itemName },
        { $inc: { quantity }, $setOnInsert: { category: product.category, price: product.price } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(inventory);
};

exports.sellFromShop = async (req, res) => {
    const stock = await ShopInventory.findById(req.params.inventoryId);
    if (!stock) return res.status(404).json({ message: "Product not found" });
    if (stock.quantity < 1) return res.status(400).json({ message: "This product is out of stock" });
    stock.quantity -= 1;
    stock.sold += 1;
    await stock.save();
    res.json(stock);
};

exports.getDashboard = async (req, res) => {
    const [shops, godown, stock] = await Promise.all([Shop.countDocuments(), Godown.find(), ShopInventory.find()]);
    const totalSales = stock.reduce((sum, item) => sum + item.sold * item.price, 0);
    const itemsSold = stock.reduce((sum, item) => sum + item.sold, 0);
    const lowStock = stock.filter(item => item.quantity <= 5).length;
    const byShop = await ShopInventory.aggregate([
        { $group: { _id: "$shop", sales: { $sum: { $multiply: ["$sold", "$price"] } }, sold: { $sum: "$sold" } } },
        { $lookup: { from: "shops", localField: "_id", foreignField: "_id", as: "shop" } },
        { $unwind: "$shop" },
        { $project: { _id: 0, name: "$shop.name", sales: 1, sold: 1 } },
        { $sort: { sales: -1 } }
    ]);
    res.json({ shops, godownItems: godown.reduce((sum, item) => sum + item.quantity, 0), totalSales, itemsSold, lowStock, byShop });
};
