import { httpServer,io } from "./app.js";
import dotenv from "dotenv"
import { connectDb } from "./db/index.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}



connectDb().then(
    ()=>{
        io.on("connection",(socket)=>{
             console.log("New io connection");
        })
        httpServer.listen(process.env.PORT || 4002,()=>{console.log("chat service http started on port ", process.env.PORT)})
    }
).catch((err)   => {
    console.log("MONGO db connection failed ", err);
})