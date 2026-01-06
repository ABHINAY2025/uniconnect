import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: String, // Roll No of the user (Owner)
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    matchedItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LostFoundItem",
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
