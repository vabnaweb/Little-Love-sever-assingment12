const express = require('express')
const app = express()
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h6t6k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
  try {
    await client.connect();
    const database = client.db("little-love");
    const productsCollection = database.collection("products")
    const ordersCollection = database.collection("orders")
    const usersCollection = database.collection("users")
    const reviewsCollection = database.collection("reviews")

    /*================================ 
              products Section 
    ================================*/

    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.json(products)
    })

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.json(result)
    })

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.json(result);
    })

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.json(result)
    })



    /*================================ 
              Orders Section 
    ================================*/

    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const order = await cursor.toArray();
      res.json(order)
    })

    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.findOne(query);
      res.json(result)
    })
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const updateStatus = req.body;
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: `Shifted`

        }

      };
      const result = await ordersCollection.updateOne(filter, updateDoc, options)
      res.json(result)
    })


    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result)
    })




    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    })



    /*================================ 
                Users Section 
    ================================*/

    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const user = await cursor.toArray();
      res.json(user)
    })

    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { Email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    })

    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { Email: user.email };
      const updateDoc = { $set: { role: 'admin' } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    })

    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { Email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;

      }
      res.json({ admin: isAdmin })
    })



    /*================================ 
              Reviews Section 
    ================================*/
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const review = await cursor.toArray();
      res.json(review)
    })

    app.put("/reviews", async (req, res) => {
      const review = req.body;
      const filter = { email: review.email };
      const options = { upsert: true };
      const updateDoc = { $set: review };
      const result = await reviewsCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    })


  }
  finally {
    // await client.close();
  }

}
run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('Welcome To Baby-Care Products World')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})