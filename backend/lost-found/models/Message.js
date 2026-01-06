import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: String, // Roll No
        required: true,
    },
    receiver: {
        type: String, // Roll No
        required: true,
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LostFoundItem",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

export default Message;
