import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true
    },

    senderId: {
      type: String,
      required: true
    },

    receiverId: {
      type: String,
      required: true
    },

    content: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: ["TEXT", "LINK", "SYSTEM"],
      default: "TEXT"
    },

    seen: {
      type: Boolean,
      default: false
    },

    seenAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });

export const Message = mongoose.model("Message", messageSchema);
