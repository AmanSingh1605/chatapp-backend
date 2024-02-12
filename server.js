import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import http from "http";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database is connected");
  })
  .catch(() => {
    console.log("Database is not connected. Something went wrong");
  });

import User from "./src/routes/user-routes.js";

app.use("/user", User);

server.listen(process.env.PORT, () => {
  console.log("Server is running!");
});
