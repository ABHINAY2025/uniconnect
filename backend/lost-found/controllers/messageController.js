import Message from "../models/Message.js";
import Notification from "../models/Notification.js";
import LostFoundItem from "../models/LostFoundItem.js";

export const sendMessage = async (req, res) => {
    try {
        const { sender, receiver, itemId, content } = req.body;

        if (!sender || !receiver || !itemId || !content) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newMessage = new Message({
            sender,
            receiver,
            itemId,
            content,
        });

        await newMessage.save();

        // Create a Notification for the receiver so they know they have a message
        // We might want to avoid spamming notifications if they are actively chatting,
        // but for now, let's notify.
        const item = await LostFoundItem.findById(itemId);
        // Simple distinct notification or reuse the notification model
        await Notification.create({
            userId: receiver,
            message: `New message from ${sender} regarding "${item ? item.description : 'item'}": ${content.substring(0, 30)}...`,
            matchedItemId: itemId,
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getConversation = async (req, res) => {
    try {
        const { itemId, user1, user2 } = req.query;

        if (!itemId || !user1 || !user2) {
            return res.status(400).json({ message: "Missing params" });
        }

        // Fetch messages between these two users for this specific item
        const messages = await Message.find({
            itemId,
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 }
            ]
        }).sort({ createdAt: 1 }); // Oldest first

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching conversation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getConversationsForItem = async (req, res) => {
    try {
        const { itemId, userId } = req.query;

        // Find all messages where the receiver is the userId and the item is itemId
        // We want to find distinct 'sender's who have messaged this user about this item
        // Also consider cases where the user initiated the chat (user is sender) -> then the other party is receiver.
        // Basically we want all unique counterparties for this item + user combo.

        const messages = await Message.find({
            itemId,
            $or: [{ receiver: userId }, { sender: userId }]
        });

        const partners = new Set();
        messages.forEach(msg => {
            if (msg.sender !== userId) partners.add(msg.sender);
            if (msg.receiver !== userId) partners.add(msg.receiver);
        });

        // Convert to array
        const conversations = Array.from(partners).map(partnerId => ({
            partnerId,
            // You could optionally attach the last message here if you want to be fancy
        }));

        res.status(200).json(conversations);

    } catch (error) {
        console.error("Error fetching conversations list:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
