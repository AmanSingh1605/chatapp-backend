import { User } from "../models/user.js";

const CreateUser = async (userData) => {
  const newUser = new User(userData);
  const response = await newUser.save();
  return response;
};

const LoginUser = async (userData) => {
  const getUser = await User.findOne({
    userName: userData.userName,
    password: userData.password,
  });
  return getUser;
};

export { CreateUser, LoginUser };
