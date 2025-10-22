import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
    },  
    content: {
        type: String,
        required: true
    }
}, { _id: false, timestamps: true }); 

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        default: "New Chat"
    },
    description: {
        type: String,
        default: "New Chat"
    },
    messages: {
        type: [messageSchema],
        default: []
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt timestamps
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
