const express = require("express"),
  bodyParser = require("body-parser"),
  { MongoClient } = require("mongodb"),
  cors = require("cors"),
  DB_URL = process.env.DB_URL || "mongodb://localhost:27017",
  app = express(),
  dotenv = require("dotenv").config();

//middleware for express
app.use(cors());
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

const products = client.db("ema_jhon").collection("products");
//default route
app.get("/", (req, res) => {
  res.status(200).send("Hello FrontPage");
});

//addProduct route
app.post("/addProduct", (req, res) => {
  const product = req.body;
  products.insertOne(product, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
