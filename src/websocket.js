import { WebSocketServer } from "ws";
import { verifyToken } from "./jwtAuth.js";

export function websocketSetup(server) {
  const wss = new WebSocketServer({ server });
  wss.on("connection", (ws, req) => {
    const token = req.url.split("=")[1];
    verifyToken(token)
      .then((data) => {
        console.log("User verified: " + data.name);
        console.log("User connected Successful");

        // websocket logics 


      })
      .catch((err) => {
        ws.close();
        console.log("Connection rejected: " + err);
      });
  });
}
