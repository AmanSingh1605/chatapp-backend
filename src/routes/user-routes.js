//routes related to user will be here
import express from "express";
import { LoginHandler, SignupHandler } from "../controllers/userControllers.js";

const router = express.Router();

//routers chats
router.get("/login",LoginHandler);
router.put("/signup", SignupHandler);

export default router;