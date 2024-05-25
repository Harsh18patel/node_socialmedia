import "dotenv/config";
import app from "./app";
import { connectDB } from "./db";
import { config } from "./config";
import { Server } from "socket.io";
import { createServer } from "http";

const port = config.port || 3000;

const httpServer = createServer(app);

const io = new Server(httpServer, {});


io.on("connection", (socket) => {
    console.log("-----------  socket  ----------->", socket.id);
    console.log("socket is connected ");

    io.emit("userConnected", `welcome user`);
    socket.on("msgSend", (msg)=>{

      
      io.emit("msgCreated",msg);
    })
    
    socket.on("disconnect", () => {
      console.log(" socket is dis-connected ");
    });
  });

  connectDB()
  .then(()=>{
    httpServer.listen(port,()=>{
        console.log(`server is running on http://localhost:${port}`);
    })
})
.catch((err)=>{
    console.log("Somthing went wrong in DB connection");
})




























