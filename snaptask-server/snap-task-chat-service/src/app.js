import express from "express";
import { createServer } from 'http';
import { Server } from "socket.io";
import cors from "cors"
import { verifySocketJwt } from "./middlewares/socket_auth.middleware.js";
import { verifyHttpJwt } from "./middlewares/http_auth.middleware.js";
const app = express();
import conversationRoute from "./routes/conversation.route.js";
import chatSocket from "./sockets/chat.socket.js";
import { socketEvents } from "./constants.js";

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(
    express.json()
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use("/conversation",verifyHttpJwt,conversationRoute);

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
});

io.use(verifySocketJwt);
io.on(socketEvents.CONNECTED,(socket)=>{
    chatSocket(io,socket);
})
export { httpServer, io };