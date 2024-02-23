import mongoose from "mongoose";
import { Chat } from "../models/chat";
import { User } from "../models/user";

//get respective chats
export const getUserChats = async (userId, otherId) => {
  const userId = new mongoose.Schema.Types.ObjectId(userId);
  const otherId = new mongoose.Schema.Types.ObjectId(otherId);
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
  const senderId = mongoose.Schema.Types.ObjectId(payload.senderId);
  const recieverId = mongoose.Schema.Types.ObjectId(payload.recieverId);
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
        }
      );

      //saved in reciever chats
      await User.findOneAndUpdate(
        { _id: recieverId, "chatIds.userId": senderId },
        {
          $push: {
            "chatIds.$.chats": chat._id,
          },
        }
      );
      return "Success";
    })
    .catch(() => {
      console.log("Chat: \n" + newChat + " \n is unable to save.");
      return "Fail to send message";
    });
};

//return all chats
export const getAllChats = async () => {
  await Chat.find()
    .then((result) => result)
    .catch((error) => {
      console.log("Unable to load chats due to some error: \n" + error);
      return "Error occured";
    });
};

//return all chats for a user
export const getUserOnlyChats = async (userId) => {
  const userId = mongoose.Schema.Types.ObjectId(userId);
  await User.findOne({ _id: userId }, { chatIds: 1 })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log("Unable to load chats: \n" + error);
      return "Failed to load chats";
    });
};
