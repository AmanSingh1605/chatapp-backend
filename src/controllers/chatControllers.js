import {
  getAllChats,
  getUserChats,
  getUserOnlyChats,
  saveChats,
} from "../services/chatServices.js";

//chat class function include p2p chats, save chat in cloud and all user chats
export class Chat {
  constructor(senderId, recieverId, message) {
    this.senderId = senderId;
    this.recieverId = recieverId;
    this.message = message;
  }

  async loadUserChat(req, res) {
    const response = await getUserChats(this.senderId, this.recieverId);
    if (response) {
      console.log(typeof response + " recieved of size " + response.length);
      res.send(response);
    } else {
      console.log("Something went wrong: ");
      res.status(500).send("Unable to load chats");
    }
  }

  async saveUserChat(req, res) {
    const payload = {
      senderId: this.senderId,
      recieverId: this.recieverId,
      message: this.message,
    };
    await saveChats(payload)
      .then((result) => res.send(result))
      .catch((error) =>
        res.staus(500).send({ Error: "Something went wrong." })
      );
  }

  async userChats() {
    await getUserOnlyChats(this.userId)
      .then((result) => res.send(result))
      .catch((error) => {
        res.status(500).send({ Error: "not able to get user chats" });
      });
  }
}

//function related to chat dbs
export const userChats = async (req, res) => {
  const userId = req.query.userId;
  await userChats(userId)
    .then((result) => res.send(result))
    .catch((err) => res.status(500).send({ Error: "Something went wrong" }));
};

export const allChats = async (req, res) => {
  await getAllChats()
    .then((result) => res.send(result))
    .catch((error) => {
      res.status(500).send({ Error: "Unable to load chats" });
    });
};
