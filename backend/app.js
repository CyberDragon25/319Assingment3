const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

// MongoDB
const url = "mongodb://localhost:27017";
const dbName = "reactdata";
const client = new MongoClient(url);
let db;

// Connect to MongoDB
client.connect((err) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    return;
  }
  console.log("Connected to MongoDB");
  db = client.db(dbName);
});

app.use(cors());
app.use(bodyParser.json());

const port = 8081;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await db.collection("products").find({}).toArray();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await db
      .collection("products")
      .findOne({ _id: ObjectId(productId) });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a product to the cart
app.post("/cart", async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await db
      .collection("products")
      .findOne({ _id: ObjectId(productId) });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    // Simulate adding the product to the cart
    const item = {
      product: product,
      quantity: quantity,
    };
    res.status(200).json({ message: "Product added to cart", item: item });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Remove a product from the cart
app.delete("/cart/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    // Simulate removing the product from the cart
    res
      .status(200)
      .json({ message: "Product removed from cart", productId: productId });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update quantity of a product in the cart
app.put("/cart/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const { quantity } = req.body;
    // Simulate updating the quantity of the product in the cart
    res
      .status(200)
      .json({
        message: "Cart updated",
        productId: productId,
        quantity: quantity,
      });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
