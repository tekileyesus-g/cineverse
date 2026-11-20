
import express from "express";

import {
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
} from "../controllers/userController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Authenticated user's profile
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

// Public profile
router.get("/:username", getPublicProfile);

export default router;
