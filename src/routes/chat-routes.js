//Routes for chats will be defined here.
import express from "express";
import { allChats } from "../controllers/chatControllers.js";
import {
  addNewUserChatHandler,
  userChatHandler,
  userOnlyChatHandler,
} from "../controllers/userControllers.js";

const router = express.Router();

//routers chats
router.get("/:userId/:senderId", userChatHandler);
router.get("/all", allChats);
router.get("/:userId", userOnlyChatHandler);
router.post("/:userId/:senderId", addNewUserChatHandler);

export default router;
