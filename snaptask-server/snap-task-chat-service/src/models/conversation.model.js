import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [String], 
      required: true,
      validate: {
        validator: (arr) => arr.length === 2,
        message: "Conversation must have exactly 2 participants"
      }
    },

    lastMessage: {
      senderId: { type: String },
      content: { type: String },
      createdAt: { type: Date }
    },

    unreadCount: {
      type: Map,
      of: Number, 
      default: {}
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);


conversationSchema.index({ participants: 1 }, { unique: true });

export const Conversation = mongoose.model(
  "Conversation",
  conversationSchema
);
