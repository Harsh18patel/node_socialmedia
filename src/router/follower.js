import express from "express";
import { getFollower, getFollowerandFollowing, getFollowing, sendRequest, unFollow } from "../controller/follower";
import { auth } from "../middleware/auth";

const router = new express.Router();

router.post("/send-request",auth,sendRequest)

router.post("/unfollow",auth, unFollow)

router.get("/allfollowers",auth, getFollowerandFollowing)



export default router;