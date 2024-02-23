//Mongo Schema Chat will be here
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    senderID: { type: Schema.Types.ObjectId, required: true },
    recieverId: { type: Schema.Types.ObjectId, required: true },
    message: String,
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);
export { Chat };
