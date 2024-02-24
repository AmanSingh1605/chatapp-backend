//Routes for chats will be defined here.
import express from "express";
import { userChats, allChats } from "../controllers/chatControllers.js";
const router = express.Router();

//routers chats
router.get("/:userId",userChats);
router.get("/",allChats);

export default router;