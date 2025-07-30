import express from "express";
import 'dotenv/config'
import dbConnect from "./db/connection.js";

const app = express();
const port = process.env.PORT || 6000;

app.get("/", (req, res) => {
  res.send("I am fine");
});


app.listen(port,() => {
  console.log(`listening on ${port}`);
  dbConnect()
});
