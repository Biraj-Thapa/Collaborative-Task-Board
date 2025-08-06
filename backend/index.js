import express from "express";
import 'dotenv/config'
import dbConnect from "./db/connection.js";
import userRouter from "./routes/user.route.js";
import projectRouter from "./routes/project.route.js"
import taskRouter from "./routes/task.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from 'http';
import { Server } from "socket.io";
import { startReminderJob } from "./cron/remainder.job.js";

startReminderJob();

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 9000;

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
app.use("/uploads", express.static("uploads"));
app.use("/api",userRouter)
app.use("/api", projectRouter);
app.use("/api", taskRouter);

io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);

  socket.on("joinProject", (projectId) => {
    socket.join(projectId);
    console.log(`User ${socket.id} joined project ${projectId}`);
  });

  socket.on("taskCreated", (projectId, task) => {
    socket.to(projectId).emit("taskCreated", task);
  });

  socket.on("taskUpdated", (projectId, task) => {
    socket.to(projectId).emit("taskUpdated", task);
  });

  socket.on("taskDeleted", (projectId, taskId) => {
    socket.to(projectId).emit("taskDeleted", taskId);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

httpServer.listen(port,() => {
  console.log(`listening on ${port}`);
  dbConnect()
});
