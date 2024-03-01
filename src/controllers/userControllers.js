import {
  CreateUser,
  LoginUser,
  addNewUserInDatabase,
} from "../services/userServices.js";
import { generateAuthToken } from "../jwtAuth.js";
import { getUserChats, getUserOnlyChats } from "../services/chatServices.js";

//store for users
const userCollection = {};

export class User {
  constructor(payload) {
    this.name = payload.name;
    this.userName = payload.userName;
    this._id = payload._id;
  }

  async userChatLoadHandler(userId) {
    const response = await getUserChats(this._id, userId);
    return response;
  }

  async addNewUser(userId) {
    const response = await addNewUserInDatabase(this._id, userId);
    return response;
  }

  async userChats() {
    const response = await getUserOnlyChats(this._id)
      .then((result) => result)
      .catch((error) => {
        console.log("Failed to get user Chats: \n" + error);
        return "Failed to get User chats. Try again";
      });
    return response;
  }
}

const LoginHandler = async (req, res) => {
  const userData = {
    userName: req.query.userName,
    password: req.query.password,
  };
  const response = await LoginUser(userData);
  // console.log(response);
  if (response) {
    //generate JSON web token
    const token = generateAuthToken(response);
    console.log("User: " + response.name + " is logged in");

    //Create an User using constructor and store in collection
    userCollection[response._id.toString()] = new User({
      name: response.name,
      userName: response.userName,
      _id: response._id,
    });
    res.send({ response, token });
  } else {
    console.log("User not found!");
    res.send("Username or password is wrong!");
  }
};

//create a new User
const SignupHandler = async (req, res) => {
  const userData = {
    name: req.query.name,
    userName: req.query.userName,
    password: req.query.password,
  };
  const response = await CreateUser(userData);
  console.log("User created: " + response.name);
  res.send(response);
};

export { LoginHandler, SignupHandler };

export async function userChatHandler(req, res) {
  const userId = req.params.userId;
  const senderId = req.params.senderId;
  const currentUser = userCollection[userId];
  if (currentUser) {
    await currentUser
      .userChatLoadHandler(senderId)
      .then((result) => res.send(result))
      .catch((err) => res.status(500).send("Not able to load chats \n" + err));
  } else {
    console.log("User not login try to login again");
    res.send("User is not login ");
  }
}

export async function addNewUserChatHandler(req, res) {
  const userId = req.params.userId;
  const senderId = req.params.senderId;
  const currentUser = userCollection[userId];
  if (currentUser) {
    await currentUser
      .addNewUser(senderId)
      .then((result) => {
        console.log("User chat added: " + senderId);
        res.send(result);
      })
      .catch((err) => res.status(500).send(err));
  } else {
    console.log("User is not login try to login again ");
    res.send("User is not login ");
  }
}

export async function userOnlyChatHandler(req, res) {
  const userId = req.params.userId;

  const currentUser = userCollection[userId];
  if (currentUser) {
    await currentUser
      .userChats()
      .then((result) => res.send(result))
      .catch(() => res.status(500).send("Something went wrong"));
  } else {
    console.log("User is not login. Not able to fetch user chats");
    res.status(500).send("Something went wrong");
  }
}
