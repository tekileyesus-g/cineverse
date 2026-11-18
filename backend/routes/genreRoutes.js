import express from "express";
import {
  createGenre,
  getGenres,
  getGenreById,
  updateGenre,
  deleteGenre,
} from "../controllers/genreController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getGenres);
router.get("/:id", getGenreById);

// Admin-only routes
router.post("/", protect, adminOnly, createGenre);
router.put("/:id", protect, adminOnly, updateGenre);
router.delete("/:id", protect, adminOnly, deleteGenre);

export default router;
