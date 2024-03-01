import { WebSocketServer } from "ws";
import { verifyToken } from "./jwtAuth.js";
import { Chat } from "./controllers/chatControllers.js";

const websocketCollection = {};

export function websocketSetup(server) {
  const wss = new WebSocketServer({ server });
  wss.on("connection", (ws, req) => {
    const token = req.url.split("=")[1];
    verifyToken(token)
      .then((data) => {
        console.log("User verified: " + data.name);
        console.log("User connected Successful");
        websocketCollection[data._id] = ws;

        // websocket logics
        ws.on("message", (recievedBufferData) => {
          const msg = JSON.parse(recievedBufferData.toString());
          console.log(typeof msg, msg);

          if (msg.type === "sendMessage") {
            const { senderId, recieverId, message } = msg.payload;
            const chatMessage = new Chat(
              senderId,
              recieverId,
              message
            );
            chatMessage.saveUserChat();
            const recieverWebsocket = websocketCollection[chatMessage.recieverId];
            if (recieverWebsocket)
              recieverWebsocket.send(JSON.stringify(chatMessage.message));
          }
        });
      })
      .catch((err) => {
        ws.close();
        console.log("Connection rejected: " + err);
      });
  });
}

/*
message should be in format: 
message = {
  type = "sendMessage"|"recieveMessage"|"broadcastMessage"|"groupMessage"|"notification",
  payload:{
    senderId: "",
    recieverId: "", // mongoId of reciever 
    recieverName: "", //username of reciever Id
    message: ""
  } 
}
*/
