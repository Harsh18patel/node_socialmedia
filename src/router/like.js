import express from "express";
import { auth } from "../middleware/auth";
import { LikeDisLike, getAll, getByUser } from "../controller/like";

const router = new express.Router();

router.use(express.json());

router.post("/like-dislike",auth, LikeDisLike);

router.get("/getByUser",auth, getByUser);

router.get("/getAll",auth, getAll);

export default router;