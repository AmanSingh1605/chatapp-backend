import mongoose from "mongoose";
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

const addNewUserInDatabase = async (userId, otherId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const otherObjectId = new mongoose.Types.ObjectId(otherId);

  const response = await User.findOneAndUpdate(
    { _id: userObjectId, "chatIds.userId": { $ne: otherObjectId } },
    {
      $addToSet: {
        chatIds: {
          $each: [{ userId: otherObjectId, chats: [] }],
        },
      },
    },
    { new: true }
  )
    .then(async () => {
      await User.findOneAndUpdate(
        { _id: otherObjectId, "chatIds.userId": { $ne: userObjectId } },
        {
          $addToSet: {
            chatIds: {
              $each: [{ userId: userObjectId, chats: [] }],
            },
          },
        },
        { new: true }
      )
        .then((result) => "successfully chat crated" + result)
        .catch(() => "Failed to create chat in reciever user side");
    })
    .catch((err) => {
      console.log("Failed to create Chat on sender user side \n" + err);
      return "Something went wrong." + err;
    });
  return response;
};

export { CreateUser, LoginUser, addNewUserInDatabase };
