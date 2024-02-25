import jwt from "jsonwebtoken";
import { CreateUser, LoginUser } from "../services/userServices.js";
import { generateAuthToken } from "../jwtAuth.js";

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
    res.send({ response, token });
  } else {
    console.log("User not found!");
    res.send("Username or password is wrong!");
  }
};

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
