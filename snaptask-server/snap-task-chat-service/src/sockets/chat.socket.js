import { socketEvents } from "../constants.js";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

export default function chatSocket(io, socket) {

  console.log("User connected:", socket.user.id);

  socket.on(socketEvents.JOIN_CONVERSATION, async ({ conversationId }) => {
    try {
      console.log(socketEvents.JOIN_CONVERSATION,"event fired from client side ")
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;

      if (!conversation.participants.includes(socket.user.id)) return;

      socket.join(conversationId);
      console.log(`User ${socket.user.id} joined ${conversationId}`);
    } catch (err) {
      console.error("JOIN_CONVERSATION error:", err);
    }
  });

  socket.on(socketEvents.SEND_MESSAGE, async ({ conversationId, content }) => {
    try {
      console.log(socketEvents.SEND_MESSAGE,"event fired from client side ")
      if (!content?.trim()) return;

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;

      const senderId = socket.user.id;
      if (!conversation.participants.includes(senderId)) return;

      const receiverId = conversation.participants.find(
        (id) => id !== senderId
      );

      const message = await Message.create({
        conversationId,
        senderId,
        receiverId,
        content
      });

      conversation.lastMessage = {
        senderId,
        content,
        createdAt: message.createdAt
      };

      conversation.unreadCount.set(
        receiverId,
        (conversation.unreadCount.get(receiverId) || 0) + 1
      );

      await conversation.save();

      io.to(conversationId).emit(socketEvents.NEW_MESSAGE, message);
    } catch (err) {
      console.error("SEND_MESSAGE error:", err);
    }
  });

  socket.on(socketEvents.MARK_SEEN, async ({ conversationId }) => {
    try {
      console.log(socketEvents.MARK_SEEN,"event fired from client side ")
      const userId = socket.user.id;

      await Message.updateMany(
        { conversationId, receiverId: userId, seen: false },
        { $set: { seen: true, seenAt: new Date() } }
      );

      await Conversation.updateOne(
        { _id: conversationId },
        { $set: { [`unreadCount.${userId}`]: 0 } }
      );
    } catch (err) {
      console.error("MARK_SEEN error:", err);
    }
  });

  socket.on(socketEvents.TYPING_START, ({ conversationId }) => {
    console.log(socketEvents.TYPING_START,"event fired from client side ")
    socket.to(conversationId).emit(socketEvents.TYPING, {
      userId: socket.user.id,
      isTyping: true
    });
    console.log(socketEvents.TYPING,"event is emmited form server");
  });

  socket.on(socketEvents.TYPING_STOP, ({ conversationId }) => {
    socket.to(conversationId).emit(socketEvents.TYPING, {
      userId: socket.user.id,
      isTyping: false
    });
  });
}
