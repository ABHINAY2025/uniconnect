import express from "express";
import { reportItem, getNotifications, getItemById, deleteNotification, resolveItem } from "../controllers/lostFoundController.js";
import { sendMessage, getConversation, getConversationsForItem } from "../controllers/messageController.js";

const router = express.Router();

router.post("/report", reportItem);
router.post("/solve", resolveItem);
router.get("/notifications", getNotifications);
router.delete("/notifications/:id", deleteNotification);
router.get("/item/:id", getItemById);

router.post("/message/send", sendMessage);
router.get("/message/conversation", getConversation);
router.get("/message/conversations-list", getConversationsForItem);

export default router;
