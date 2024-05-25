import express from "express";
import { createPost, deletePost, getAllPost, uploadImage } from "../controller/post";
import { auth } from "../middleware/auth";
import { imageUpload } from "../middleware/imageUpload";

import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "/public/";

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString()+'.'+`${file.originalname.split('.').pop()}`);
    // cb(null, "profile" + "." + `${file.originalname.split(".").pop()}`);
  },
});

const upload = multer({ storage });

const router = new express.Router();

router.use(express.json());

router.post("/create", auth, createPost);
router.post("/uploadimage", uploadImage);


router.get("/getAll", getAllPost);

router.delete("/delete/:id", auth, deletePost);

// router.post("/upload", upload.single("photo"), async (req, res) => {
//   let url = await imageUpload(req.file.url);
//   console.log("🚀 ~ router.post ~ url:", url)
//   res.status(200).send({ data: url, success: true, message: "" });
// });

router.post("/upload", upload.single("photo"), async (req, res) => {
  try {
      const url = await imageUpload(req.file.path);
      res.status(200).send({ data: url, success: true, message: "Upload successful" });
  } catch (error) {
      res.status(500).send({ success: false, message: "Upload failed", error });
  }
});


router.post("/uploads", upload.array("photos", 12), async (req, res) => {
  try {
      const urls = await Promise.all(req.files.map(async (file) => {
          const url = await imageUpload(file.path);
          return url;
      }));
      res.status(200).send({ data: urls, success: true, message: "Multiple photo uploads successful" });
  } catch (error) {
      res.status(500).send({ success: false, message: "Multiple photo uploads failed", error });
  }
});


export default router;
