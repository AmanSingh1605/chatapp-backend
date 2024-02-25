//routes related to user will be here
import express from "express";
import { LoginHandler, SignupHandler } from "../controllers/userControllers.js";
import Chats from "../routes/chat-routes.js";

const router = express.Router();

//routers chats
router.get("/login", LoginHandler);
router.post("/signup", SignupHandler);
router.use("/chats", Chats);
export default router;
