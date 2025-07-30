import express from "express";
const app = express();
const port = 9000;

app.get("/", (req, res) => {
  res.send("I am fine");
});

app.listen(port,() => {
  console.log(`listening on ${port}`);
});
