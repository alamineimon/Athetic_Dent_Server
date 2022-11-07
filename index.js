const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

//mmiddle wares
app.use(cors());
app.use(express.json());


app.get("/", (res, req) => {
  req.send("Incredible Trip server is running");
});


app.listen(port, () => {
  console.log(`Incredible Trip Server running onporrt: ${port}`);
});
