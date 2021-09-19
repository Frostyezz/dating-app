import express from "express";
import { sendHistory } from "../controllers/chatHandlers.js";

const router = express.Router();

router.get("/:id/history", sendHistory);

export default router;
