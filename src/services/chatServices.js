import mongoose from "mongoose";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";

//get respective chats
export const getUserChats = async (uId, oId) => {
  const userId = new mongoose.Types.ObjectId(uId);
  const otherId = new mongoose.Types.ObjectId(oId);
  const UserChats = await User.aggregate(
    { $match: { _id: userId } },
    { $unwind: "$chatIds" },
    { $match: { "chatIds.userId": otherId } },
    {
      $lookup: {
        from: "chats",
        localField: "chatIds.chats",
        foreignField: "_id",
        as: "chatData",
      },
    },
    {
      $project: {
        "chatIds.chats": "$chatData",
      },
    }
  );

  return UserChats;
};

//save chats for a user
export const saveChats = async (payload) => {
  const senderId = new mongoose.Types.ObjectId(payload.senderId);
  const recieverId = new mongoose.Types.ObjectId(payload.recieverId);
  const newChat = new Chat({
    senderId,
    recieverId,
    message: payload.message,
  });
  const response = await newChat
    .save()
    .then(async (chat) => {
      //saved in user chats
      await User.findOneAndUpdate(
        { _id: senderId, "chatIds.userId": recieverId },
        {
          $push: {
            "chatIds.$.chats": chat._id,
          },
        },
        { upsert: true }
      );

      //saved in reciever chats
      await User.findOneAndUpdate(
        { _id: recieverId, "chatIds.userId": senderId },
        {
          $push: {
            "chatIds.$.chats": chat._id,
          },
        },
        { upsert: true }
      );
      return "Success";
    })
    .catch((err) => {
      console.log(
        "Chat: \n" + newChat + " \n is unable to save due to : \n " + err
      );
      return "Fail to send message";
    });
  return response;
};

//return all chats
export const getAllChats = async () => {
  const response = await Chat.find()
    .then((result) => {
      console.log("all chats successfully fetched");
      return result;
    })
    .catch((error) => {
      console.log("Unable to load chats due to some error: \n" + error);
      return "Error occured";
    });
  return response;
};

//return all chats for a user
export const getUserOnlyChats = async (uId) => {
  const userId = new mongoose.Types.ObjectId(uId);
  const response = await User.findOne({ _id: userId }, { chatIds: 1 })
    .populate("chatIds.chats")
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => {
      console.log("Unable to load chats: \n" + error);
      return "Failed to load chats";
    });
  return response;
};
