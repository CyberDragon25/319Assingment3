const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
var app = express();
const { MongoClient, ObjectId } = require("mongodb");
var nextID = 35;

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

app.post("/addProduct", async (req, res) => {
  try 
  {
      await client.connect();
      const newDocument = {
          "id" : nextID++,
          "title": req.body.title,
          "price": parseInt(req.body.price),
          "description": req.body.description,
          "category": req.body.category,
          "imageUrl": req.body.imageUrl,
          "rating": {"rate":parseInt(req.body.rating), "count":1}
      };
      const results = await db
      .collection("products")
      .insertOne(newDocument);
      res.status(200);
      res.send(results);
  } 
  catch (error)
  {
      console.error("An error occurred:", error);
      res.status(500).send({ error: 'An internal server error occurred' });
  }
 
});

app.delete("/delete/:id", async (req, res) => {
  try
  {
      const id = Number(req.params.id);
      await client.connect();
      console.log("Product to delete :",id);
      const query = { id: id };
      const results = await db.collection("products").deleteOne(query);
      res.status(200);
      res.send(results);
  }
  catch (error)
  {
      console.error("Error deleting robot:", error);
      res.status(500).send({ message: 'Internal Server Error' });
  }
  });


  app.put("/update/:id", async (req, res) => {
    const id = Number(req.params.id);
    const query = { id: id };
    await client.connect();
    console.log("Robot to Update :",id);
    // Data for updating the document, typically comes from the request body
    console.log(req.body);
    const updateData = {
        $set:{
            "price": parseInt(req.body.price),
        }
    };
    // Add options if needed, for example { upsert: true } to create a document if it doesn't exist
    const options = { };
    const results = await db.collection("products").updateOne(query, updateData, options);
    res.status(200);
    res.send(results);
});
