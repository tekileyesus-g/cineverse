import express from "express";

import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
  markAsWatched,
  getWatchedMovies,
  removeFromWatched,
} from "../controllers/userMovieController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Watchlist
router.post("/watchlist", addToWatchlist);
router.get("/watchlist", getWatchlist);
router.delete("/watchlist/:movieId", removeFromWatchlist);

// Watched movies
router.post("/watched", markAsWatched);
router.get("/watched", getWatchedMovies);
router.delete("/watched/:movieId", removeFromWatched);

export default router;
