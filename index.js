const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

//mmiddle wares
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.juguzvf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("athetic").collection("services");
    const reviewsCollection = client.db("athetic").collection("review");


    //for get all service
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
// get 3  service with condditionally
       app.get("/", async (req, res) => {
         const query = {};
         const cursor = serviceCollection.find(query).limit(3);
         const services = await cursor.toArray();
         res.send(services);
       });

    //for get service  with  id
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const services = await serviceCollection.findOne(query);
      res.send(services);
    });

//for  possting  review
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    });


    //for  get  all  review
    app.get("/allreview", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewsCollection.find(query);
      const review = await cursor.toArray();
      console.log(review);
      res.send(review);
    });

    //for delete review with  id
    app.delete("/allreview/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewsCollection.deleteOne(query);
      res.send(result);
    });

// for  get  review with id
    app.get("/allreview/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewsCollection.findOne(query);
      res.send(result);
    });

//for updaate  review with  id
    app.put("/allreview/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const user = req.body;
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          message: user.message,
        },
      };
      const result = await reviewsCollection.updateOne(
        filter,
        updatedUser,
        option
      );
      res.send(result);
    });

    //for post service
    app.post('/addServices', async(req, res)=>{
            const addService = req.body ;
            console.log(addService);
            const result = await serviceCollection.insertOne(addService);
            res.send(result);
        })



  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (res, req) => {
  req.send("Athetic Dent server is running");
});

app.listen(port, () => {
  console.log(`Athetic Dent Server running onporrt: ${port}`);
});
