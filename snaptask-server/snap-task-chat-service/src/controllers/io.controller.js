import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getOrCreateConversation  = asyncHandler( async (req,res)=>{
    const senderId = req.user.id;
    const {receiverId } = req.body;
    console.log("getorCreateConversatin endpoint hit")
    if(!senderId || !receiverId){
        console.log("can not found senderId or receiverId ");
        throw new ApiError(400, "snederId or receiverId  not found");
    }

    if(senderId===receiverId){
        throw new ApiError(400,"Cannot create conversation with yourself");
    }

    const participants = [senderId,receiverId].sort();

    const conversation = await Conversation.findOne({
        participants
    });

    if(conversation){
        return res.status(200).json(new ApiResponse(200,conversation._id));
    }

    const newConversation = await Conversation.create({
        participants,
        unreadCount:{
            [senderId]:0,
            [receiverId]:0
        }
    });

    return res.status(200).json(new ApiResponse(200,newConversation._id));
})


const getMessages = asyncHandler(async (req, res) => {
  console.log("getMessages endpoint hit---------------------");
  const { conversationId } = req.params;
  const userId = req.user.id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  
  if (!conversation.participants.includes(userId)) {
    throw new ApiError(403, "You are not allowed to access this conversation");
  }

  
  const messages = await Message.find({ conversationId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  
  const totalMessages = await Message.countDocuments({ conversationId });

  return res.status(200).json(
    new ApiResponse(200, {
      messages: messages.reverse(), 
      pagination: {
        page,
        limit,
        totalMessages,
        totalPages: Math.ceil(totalMessages / limit)
      }
    })
  );
});

export {
    getOrCreateConversation,
    getMessages
}