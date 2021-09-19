import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import Chat from "./models/chats.js";
import multer from "multer";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 1000000 })
);
app.use(cors());

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongo");
  })
  .catch((err) => {
    console.log(err);
  });
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.PRODUCTION_URL,
    methods: ["GET", "POST"],
  },
});
httpServer.listen(process.env.PORT || 3030, () => console.log("Listening"));

io.on("connection", (socket) => {
  socket.on("subscribe", (id) => {
    socket.join(id);
  });
  socket.on("sendMessage", ({ message, sender, id }) => {
    io.to(id).emit("message", { message, sender });

    Chat.findByIdAndUpdate(id, {
      $push: { messages: { message, sender } },
    }).then(() => {});
  });
});

import { storage } from "./cloudinary/index.js";
const upload = multer({ storage });

app.post("/account/save_file", upload.single("file"), async (req, res) => {
  try {
    res.json({ file: req.file });
  } catch (error) {
    res.json({ error });
  }
});

import accountRoutes from "./routes/account.js";
import chatRoutes from "./routes/chat.js";
app.use("/account", accountRoutes);
app.use("/chats", chatRoutes);
