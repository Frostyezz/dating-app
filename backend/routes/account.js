import express from "express";
import {
  signup,
  signin,
  saveInfo,
  saveImgs,
  profileInfo,
  sendComps,
  updateLocation,
  saveSettings,
  addLike,
  addRejection,
  sendMatches,
  sendProfile,
} from "../controllers/accountHandlers.js";
const router = express.Router();

router.post("/signup", signup);

router.post("/login", signin);

router.post("/save_info", saveInfo);

router.post("/save_imgs", saveImgs);

router.get("/:id", profileInfo);

router.get("/:id/comps", sendComps);

router.post("/location", updateLocation);

router.post("/:id/settings", saveSettings);

router.post("/like", addLike);

router.post("/reject", addRejection);

router.post("/matches", sendMatches);

router.post("/chat", sendProfile);

export default router;
