import mongoose from "mongoose";
import UserMovie from "../models/UserMovie.js";
import Movie from "../models/Movie.js";

// ADD MOVIE TO WATCHLIST
export const addToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({
        message: "Invalid movie ID.",
      });
    }

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found.",
      });
    }

    const existing = await UserMovie.findOne({
      user: req.user._id,
      movie: movieId,
    });

    if (existing) {
      return res.status(409).json({
        message:
          existing.status === "watched"
            ? "This movie is already in your watched list."
            : "Movie is already in your watchlist.",
      });
    }

    const entry = await UserMovie.create({
      user: req.user._id,
      movie: movieId,
      status: "watchlist",
    });

    return res.status(201).json({
      message: "Movie added to watchlist.",
      entry,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Movie already exists in your collection.",
      });
    }

    console.error("Add watchlist error:", error);

    return res.status(500).json({
      message: "Server error while adding movie to watchlist.",
    });
  }
};

// GET MY WATCHLIST
export const getWatchlist = async (req, res) => {
  try {
    const entries = await UserMovie.find({
      user: req.user._id,
      status: "watchlist",
    })
      .populate(
        "movie",
        "title description poster releaseYear director averageRating ratingCount genres",
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: entries.length,
      watchlist: entries,
    });
  } catch (error) {
    console.error("Get watchlist error:", error);

    return res.status(500).json({
      message: "Server error while fetching watchlist.",
    });
  }
};

// REMOVE MOVIE FROM WATCHLIST
export const removeFromWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({
        message: "Invalid movie ID.",
      });
    }

    const entry = await UserMovie.findOneAndDelete({
      user: req.user._id,
      movie: movieId,
      status: "watchlist",
    });

    if (!entry) {
      return res.status(404).json({
        message: "Movie not found in your watchlist.",
      });
    }

    return res.status(200).json({
      message: "Movie removed from watchlist.",
    });
  } catch (error) {
    console.error("Remove watchlist error:", error);

    return res.status(500).json({
      message: "Server error while removing movie.",
    });
  }
};

// MARK MOVIE AS WATCHED
export const markAsWatched = async (req, res) => {
  try {
    const { movieId } = req.body;

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({
        message: "Invalid movie ID.",
      });
    }

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found.",
      });
    }

    const existing = await UserMovie.findOne({
      user: req.user._id,
      movie: movieId,
    });

    if (existing?.status === "watched") {
      return res.status(409).json({
        message: "Movie is already in your watched list.",
      });
    }

    let entry;

    if (existing) {
      existing.status = "watched";
      existing.watchedAt = new Date();
      entry = await existing.save();
    } else {
      entry = await UserMovie.create({
        user: req.user._id,
        movie: movieId,
        status: "watched",
        watchedAt: new Date(),
      });
    }

    return res.status(200).json({
      message: "Movie marked as watched.",
      entry,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Movie already exists in your collection.",
      });
    }

    console.error("Mark watched error:", error);

    return res.status(500).json({
      message: "Server error while marking movie as watched.",
    });
  }
};

// GET MY WATCHED MOVIES
export const getWatchedMovies = async (req, res) => {
  try {
    const entries = await UserMovie.find({
      user: req.user._id,
      status: "watched",
    })
      .populate(
        "movie",
        "title description poster releaseYear director averageRating ratingCount genres",
      )
      .sort({ watchedAt: -1 });

    return res.status(200).json({
      count: entries.length,
      watchedMovies: entries,
    });
  } catch (error) {
    console.error("Get watched movies error:", error);

    return res.status(500).json({
      message: "Server error while fetching watched movies.",
    });
  }
};

// REMOVE MOVIE FROM WATCHED LIST
export const removeFromWatched = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({
        message: "Invalid movie ID.",
      });
    }

    const entry = await UserMovie.findOneAndDelete({
      user: req.user._id,
      movie: movieId,
      status: "watched",
    });

    if (!entry) {
      return res.status(404).json({
        message: "Movie not found in your watched list.",
      });
    }

    return res.status(200).json({
      message: "Movie removed from watched list.",
    });
  } catch (error) {
    console.error("Remove watched error:", error);

    return res.status(500).json({
      message: "Server error while removing watched movie.",
    });
  }
};
