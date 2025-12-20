import { Router } from "express";
import { getOrCreateConversation,getMessages } from "../controllers/io.controller.js";


const router = new Router();

router.route("/").post(getOrCreateConversation);
router.route("/:conversationId/message").get(getMessages);
export default router;
