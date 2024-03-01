import {
  getAllChats,
  getUserChats,
  saveChats,
} from "../services/chatServices.js";

//chat class function include p2p chats, save chat in cloud and all user chats
export class Chat {
  constructor(senderId, recieverId, message) {
    this.senderId = senderId;
    this.recieverId = recieverId;
    this.message = message;
  }

  async saveUserChat() {
    const payload = {
      senderId: this.senderId,
      recieverId: this.recieverId,
      message: this.message,
    };

    await saveChats(payload)
      .then((result) => {
        console.log("message sent to user successfully");
      })
      .catch((error) => {
        console.log("Something went wrong: \n" + error);
      });
  }


}

//function related to chat dbs

//return all chats in dbs
export const allChats = async (req, res) => {
  await getAllChats()
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send({ Error: "Unable to load chats : \n" + error });
    });
};

//load userChat with another user
export async function loadUserChat(req, res) {
  const response = await getUserChats(this.senderId, this.recieverId);
  if (response) {
    console.log(typeof response + " recieved of size " + response.length);
    res.send(response);
  } else {
    console.log("Something went wrong: ");
    res.status(500).send("Unable to load chats");
  }
}
