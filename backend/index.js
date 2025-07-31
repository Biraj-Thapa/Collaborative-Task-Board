import express from "express";
import 'dotenv/config'
import dbConnect from "./db/connection.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const port = process.env.PORT || 6000;

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))
app.use("/api",userRouter)


app.listen(port,() => {
  console.log(`listening on ${port}`);
  dbConnect()
});
