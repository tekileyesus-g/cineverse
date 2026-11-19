import express from "express";

import {
  createRating,
  updateRating,
  getMovieRatings,
  deleteRating,
} from "../controllers/ratingController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/movie/:movieId", getMovieRatings);

router.post("/", protect, createRating);
router.put("/:movieId", protect, updateRating);
router.delete("/:movieId", protect, deleteRating);

export default router;
