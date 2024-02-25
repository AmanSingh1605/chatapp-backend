import express from "express";
import bodyParser from "body-parser";
import http from "http";
import dotenv from "dotenv";
import { websocketSetup } from "./src/websocket.js";
import { databaseSetup } from "./src/mongodb.js";
import User from "./src/routes/user-routes.js";

//configuring dotenv
dotenv.config({
  path: "./.env",
});

const app = express();
//http server
const server = http.createServer(app);

//for input and output data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//mongoDB database connect through mongoose
databaseSetup();

//websocket connection
websocketSetup(server);

//routes
app.use("/user", User);



//server port
server.listen(process.env.PORT, () => {
  console.log("Server is running on port: " + process.env.PORT);
});
