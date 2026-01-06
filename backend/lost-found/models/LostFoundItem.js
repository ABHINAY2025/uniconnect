import mongoose from "mongoose";

const lostFoundItemSchema = new mongoose.Schema({
    reportedBy: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open",
    },
    type: {
        type: String,
        enum: ["lost", "found"],
        required: true,
    },
}, { timestamps: true });

const LostFoundItem = mongoose.model("LostFoundItem", lostFoundItemSchema);

export default LostFoundItem;
