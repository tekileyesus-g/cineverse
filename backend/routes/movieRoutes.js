import express from "express";
import {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";

const router = express.Router();

// POST /api/movies
router.post("/", createMovie);

// GET /api/movies
router.get("/", getMovies);

// GET /api/movies/:id
router.get("/:id", getMovieById);

// PUT /api/movies/:id
router.put("/:id", updateMovie);

// DELETE /api/movies/:id
router.delete("/:id", deleteMovie);
export default router;
