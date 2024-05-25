import mongoose from "mongoose"
import { config } from "../config";


export const connectDB = (params)=>{
    return mongoose
    .connect(config.db_url)
    .then(()=>{
        console.log("database connected");
    })
    .catch((err)=>{
        console.log("error at databse connection",err);
        res.send(err);
    })
}















