import express from "express";
import {
  create,
  forgetPassword,
  getUserData,
  login,
  logout,
  otp,
  resetPassword,
} from "../controller";
import { auth } from "../middleware/auth";
// import multer from "multer";
// import fs from "fs";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = "./public/";
//     console.log("🚀 ~ uploadDir:", uploadDir);
//     // // Check if the directory exists, if not, create it
//     // // fs.existsSync  This function checks whether the specified path exists in the file system.
//     // fs.mkdirSync This function creates a new directory synchronously.
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     // cb(null, Date.now().toString()+'.'+`${file.originalname.split('.').pop()}`);
//     cb(null, "profile" + "." + `${file.originalname.split(".").pop()}`);
//   },
// });

// const upload = multer({ storage });
const router = new express.Router();

router.use(express.json());

router.post("/create", create);

router.post("/users", getUserData);

router.post("/login", login);

router.post("/logout", logout);

router.post("/resetpassword", auth, resetPassword);

router.post("/sendotp", otp);

router.post("/forgetpassword", forgetPassword);

// router.post("/upload", upload.single("photo"), (req, res) => {
//   console.log("----file--", req.file);

//   res.status(200).send(req.file);
// });

// router.post("/uploads", upload.array("photos", 12), (req,res)=>{
//   console.log("---multifile--", req.files);
//   res.status(200).send(req.files)
// })

export default router;
