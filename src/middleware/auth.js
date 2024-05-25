import jwt from "jsonwebtoken";
import { config } from "../config";
import { modal } from "../models";

export const auth = async (req,res,next) => {
    try{
        let token = req?.headers?.["x-token"];
        console.log("🚀 ~ auth ~ token:", token)
        if(!token) throw new Error("token is not valid or expired");
        else{
            let data = jwt.verify(token, config.secret_key);
            console.log("🚀 ~ auth ~ data:", data)
            const user = await modal.User.findById(data?.userId);
            console.log("🚀 ~ auth ~ user:", user)
            if (!user)  throw new Error("User not found");
            req.me = user;
            req.me.userId = data.userId;
            next();
        }
    }
    catch(error){
        res.status(400).send({
            succsess: false,
            data: null,
            message: error.message
        })
    }
}

export const adminAuth = (req,res,next)=>{
    if(req.me.userType === "admin") next();
    else throw new Error("only admin are allowed");
}


  
