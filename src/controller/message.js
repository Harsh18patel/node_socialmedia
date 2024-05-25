import { modal } from "../models";
import NodeCache from "node-cache";

const myCache = new NodeCache();

export const getAllMesssage = (req,res)=>{
   
    let value = myCache.get("msg");
    console.log("🚀 ~ getAllMesssage ~ value:", value)

    if(value){
        res.status(200).send({
            success: true,
            data: value,
            message: "come from cache"
        })
    }
    else{
        modal.Message.find({senderId: req?.me?._id})
        .then((resData)=>{
            myCache.set("msg",resData,5)
            res.status(200).send({
                data:resData,
                success:true,
                message:"come from database"
            })
        })
        .catch((err)=>{
            res.status(400).send({
                data:null,
                success:false,
                message:err.message
            })
        })
    }
}

export const sendMessage = (req,res)=>{
    let input = req?.body;
    input.senderId = req?.me?._id;

    modal.Message.create(input)
    .then((resData)=>{
        res.status(200).send({
            data: resData,
            success: true,
            message: ""
        })
    })
    .catch((err)=>{
        res.status(400).send({
            data:null,
            success: false,
            message: err.message
        })
    })
}

export const deleteMessage = (req,res) =>{
    let input = req?.params?.id;
    modal.Message.findByIdAndDelete(input)
    .then((resData)=>{
        res.status(200).send({
            success:true,
            data:resData,
            message:"message is delete"
        })
    })
    .catch((err)=>{
        res.status(400).send({
            success:false,
            data:null,
            message:err.message
        })
    })
}