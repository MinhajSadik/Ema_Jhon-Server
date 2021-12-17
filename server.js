const express = require("express"),
  bodyParser = require("body-parser"),
  { MongoClient } = require("mongodb"),
  cors = require("cors"),
  DB_URL = process.env.DB_URL || "mongodb://localhost:27017",
  app = express(),
  dotenv = require("dotenv").config();

//middleware for express
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Connection URL
const PORT = process.env.PORT || 3100;
const options = { useNewUrlParser: true, useUnifiedTopology: true };
const client = new MongoClient(DB_URL, options);
client.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Database Connected...");
  }
});

const productsCollections = client.db("ema_jhon").collection("allProducts");
const ordersCollections = client.db("ema_jhon").collection("orderInfo");
//default route
app.get("/", (req, res) => {
  res.status(200).send("Hello Ema_Jhon-Server FrontPage");
});

//addProduct route
app.post("/addProduct", (req, res) => {
  const product = req.body;
  productsCollections.insertOne(product, (err, result) => {
    if (err) {
      console.error(err.message);
    } else {
      res.status(200).send(result);
      console.log("Product Added", result.insertedCount);
    }
  });
});

//products route
app.get("/products", (req, res) => {
  productsCollections.find({}).toArray((err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.status(200).send(result);
    }
  });
});

//product with dynamic key
app.get("/product/:key", (req, res) => {
  productsCollections.find({ key: req.params.key }).toArray((err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.status(200).send(result[0]);
    }
  });
});

//productsByKeys route
app.post("/productsByKeys", (req, res) => {
  const productKeys = req.body;
  productsCollections
    .find({ key: { $in: productKeys } })
    .toArray((err, results) => {
      if (err) {
        console.error(err);
      } else {
        res.status(200).send(results);
      }
    });
});

//orderInfo route
app.post("/addOrder", (req, res) => {
  const orderInfo = req.body;
  ordersCollections.insertOne(orderInfo, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.status(200).send(result);
    }
  });
});

app.get("/user", (req, res) => {
  ordersCollections.find({}).toArray((err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.status(200).send(result);
    }
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
