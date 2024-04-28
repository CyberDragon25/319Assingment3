const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
var app = express();
const { MongoClient, ObjectId } = require("mongodb");

app.use(cors());
app.use(bodyParser.json());

// MongoDB
const url = "mongodb://localhost:27017";
const dbName = "reactdata";
const client = new MongoClient(url);
const db = client.db(dbName);

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
  await client.connect();
  try {
    const query = {};
    const results = await db
    .collection("products")
    .find(query)
    .limit(100)
    .toArray();
    console.log(results);
    res.status(200);
    res.send(results);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get product by ID
app.get("/products/:id", async (req, res) => {
  console.log("its getting here");
  const productId = Number(req.params.id);
  console.log("Product to find :", productId);
  await client.connect();
  console.log("Node connected successfully to GET-id MongoDB");
  const query = {"id": productId };
  const results = await db.collection("products")
  .findOne(query);
  console.log("Results :", results);
  if (!results) res.send("Not Found").status(404);
  else res.send(results).status(200);
});

