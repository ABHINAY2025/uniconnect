import express from "express";
import { createExperience } from "./experience.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {getMyExperiences } from "./experience.controller.js";
import { searchExtractedQuestions } from "./experience.controller.js";


const router = express.Router();

router.post("/", authMiddleware, createExperience);
router.get("/", authMiddleware, getMyExperiences);
router.get("/search", authMiddleware, searchExtractedQuestions);
export default router;
