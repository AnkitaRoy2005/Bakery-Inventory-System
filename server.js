require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// Basic demo authentication for the inventory screens.
app.post("/auth/login", (req, res) => {
    const username = String(req.body.username || "").trim().toLowerCase();
    const password = String(req.body.password || "").trim();

    if (username === "admin" && password === "admin123") {
        return res.json({ role: "admin", name: "Administrator" });
    }
    if (username === "shop" && password === "shop123") {
        return res.json({ role: "shop", name: "Shop Staff" });
    }
    return res.status(401).json({ message: "Incorrect username or password" });
});

// Routes
app.use("/products", require("./routes/productRoutes"));
app.use("/godown", require("./routes/godownRoutes"));
app.use("/shops", require("./routes/shopRoutes"));
app.use("/dashboard", require("./routes/dashboardRoutes"));

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
