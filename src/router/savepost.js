import express from "express";
import { getAll, savePost } from "../controller/savepost";
import { auth } from "../middleware/auth";

const router = new express.Router();

router.use(express.json());

router.post("/savepost",auth,savePost);
router.get("/getAll",auth,getAll);

export default router;