import express from "express";
import { deleteMessage, getAllMesssage, sendMessage } from "../controller/message";
import { auth } from "../middleware/auth";

const router = new express.Router();

router.post("/send-message",auth,sendMessage)

router.get("/getall-message",auth,getAllMesssage)

router.delete("/delete-message/:id",auth, deleteMessage)

export default router;