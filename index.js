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

    //all service data loaad
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });


    // load a single data from mangodb 
        app.get('/services/:id' , async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const services = await serviceCollection.findOne(query)
            res.send(services);
        });
    app.post('/review', async(req, res)=>{
            const review = req.body ;
            const result = await reviewsCollection.insertOne(review);
            res.send(result) 
    });

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



    app.delete("/allreview/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewsCollection.deleteOne(query);
      res.send(result);
    });


  }
  finally{

  }
}
 run().catch(err =>console.error(err))




app.get("/", (res, req) => {
  req.send("Incredible Trip server is running");
});


app.listen(port, () => {
  console.log(`Incredible Trip Server running onporrt: ${port}`);
});
