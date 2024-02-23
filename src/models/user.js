//Mongo Schema for User.
import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    chatIds: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        chats: [{type: mongoose.Schema.Types.ObjectId, ref:'Chat'}]
      }
    ],
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export { User };
