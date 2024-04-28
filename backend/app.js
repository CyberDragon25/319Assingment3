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

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const port = 8081;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

// Product API Endpoints
app.get("/products", getAllProducts);
app.get("/products/:id", getProductById);
app.post("/products", addProduct);
app.put("/products/:id", updateProduct);
app.delete("/products/:id", deleteProduct);

// Product functions
async function getAllProducts(req, res) {
  try {
    const products = await db.collection("products").find({}).toArray();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getProductById(req, res) {
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
}

async function addProduct(req, res) {
  try {
    const newProduct = req.body;
    const result = await db.collection("products").insertOne(newProduct);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateProduct(req, res) {
  try {
    const productId = req.params.id;
    const updatedProduct = req.body;
    const result = await db
      .collection("products")
      .updateOne({ _id: ObjectId(productId) }, { $set: updatedProduct });
    if (result.modifiedCount === 0) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({ message: "Product updated" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteProduct(req, res) {
  try {
    const productId = req.params.id;
    const result = await db
      .collection("products")
      .deleteOne({ _id: ObjectId(productId) });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
