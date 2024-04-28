const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// MongoDB
const url = "mongodb://localhost:27017";
const dbName = "secoms319";
const client = new MongoClient(url, { useUnifiedTopology: true });
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

const port = 8081;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const results = await db.collection("products").find().toArray();
    console.log(results);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get product by ID
app.get("/products/:id", async (req, res) => {
  const productId = Number(req.params.id);
  console.log("Product to find :", productId);
  try {
    const query = { id: productId };
    const result = await db.collection("products").findOne(query);
    if (!result) {
      res.status(404).send("Not Found");
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/insert", async (req, res) => {
  console.log(req.body);
  const p_id = req.body._id;
  const ptitle = req.body.title;
  const pprice = req.body.price;
  const pdescription = req.body.description;
  const pcategory = req.body.category;
  const pimage = req.body.image;
  const prate = req.body.rating.rate;
  const pcount = req.body.rating.count;

  const formData = new Product({
    _id: p_id,
    title: ptitle,
    price: pprice,
    description: pdescription,
    category: pcategory,
    image: pimage,
    rating: { rate: prate, count: pcount },
  });
  try {
    // await formData.save();
    await Product.create(formData);
    const messageResponse = { message: `Product ${p_id} added correctly` };
    res.send(JSON.stringify(messageResponse));
  } catch (err) {
    console.log("Error while adding a new product:" + err);
  }
});

app.delete("/delete", async (req, res) => {
  console.log("Delete :", req.body);
  try {
    const query = { _id: req.body._id };
    await Product.deleteOne(query);
    const messageResponse = {
      message: `Product ${req.body._id} deleted correctly`,
    };
    res.send(JSON.stringify(messageResponse));
  } catch (err) {
    console.log("Error while deleting :" + p_id + " " + err);
  }
});

app.put("/update", async (req, res) => {
  try {
    const updatedProduct = req.body;
    const query = { _id: updatedProduct._id };
    await Product.findOneAndUpdate(query, updatedProduct, { new: true });
    const messageResponse = {
      message: `Product ${updatedProduct._id} updated correctly`,
    };
    res.send(JSON.stringify(messageResponse));
  } catch (err) {
    console.log("Error while updating product: " + err);
  }
});
