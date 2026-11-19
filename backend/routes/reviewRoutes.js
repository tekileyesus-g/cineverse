import express from "express";

import {
  createReview,
  getMovieReviews,
  updateReview,
  deleteReview,
  getMyReviews,
} from "../controllers/reviewController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/movie/:movieId", getMovieReviews);

router.post("/", protect, createReview);
router.get("/my", protect, getMyReviews);
router.put("/:reviewId", protect, updateReview);
router.delete("/:reviewId", protect, deleteReview);

export default router;
