import mongoose from "mongoose";
import Rating from "../models/Rating.js";
import Movie from "../models/Movie.js";

// Recalculate movie's average rating
const updateMovieRating = async (movieId) => {
  const result = await Rating.aggregate([
    {
      $match: {
        movie: new mongoose.Types.ObjectId(movieId),
      },
    },
    {
      $group: {
        _id: "$movie",
        average: { $avg: "$value" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (result.length === 0) {
    await Movie.findByIdAndUpdate(movieId, {
      averageRating: null,
      ratingCount: 0,
    });

    return;
  }

  await Movie.findByIdAndUpdate(movieId, {
    averageRating: Math.round(result[0].average * 10) / 10,
    ratingCount: result[0].count,
  });
};

// CREATE RATING
export const createRating = async (req, res) => {
  try {
    const { movieId } = req.body;
    const { value } = req.body;

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({
        message: "Invalid movie ID.",
      });
    }

    if (
      value === undefined ||
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value < 0 ||
      value > 10
    ) {
      return res.status(400).json({
        message: "Rating must be a number between 0 and 10.",
      });
    }

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found.",
      });
    }

    const existingRating = await Rating.findOne({
      user: req.user._id,
      movie: movieId,
    });

    if (existingRating) {
      return res.status(409).json({
        message:
          "You have already rated this movie. Update your rating instead.",
      });
    }

    const rating = await Rating.create({
      user: req.user._id,
      movie: movieId,
      value,
    });

    await updateMovieRating(movieId);

    return res.status(201).json({
      message: "Movie rated successfully.",
      rating,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already rated this movie.",
      });
    }

    console.error("Create rating error:", error);

    return res.status(500).json({
      message: "Server error while creating rating.",
    });
  }
};

// UPDATE MY RATING
export const updateRating = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { value } = req.body;

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({
        message: "Invalid movie ID.",
      });
    }

    if (
      value === undefined ||
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value < 0 ||
      value > 10
    ) {
      return res.status(400).json({
        message: "Rating must be a number between 0 and 10.",
      });
    }

    const rating = await Rating.findOneAndUpdate(
      {
        user: req.user._id,
        movie: movieId,
      },
      {
        value,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!rating) {
      return res.status(404).json({
        message: "You have not rated this movie yet.",
      });
    }

    await updateMovieRating(movieId);

    return res.status(200).json({
      message: "Rating updated successfully.",
      rating,
    });
  } catch (error) {
    console.error("Update rating error:", error);

    return res.status(500).json({
      message: "Server error while updating rating.",
    });
  }
};

// GET RATINGS FOR A MOVIE
export const getMovieRatings = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({
        message: "Invalid movie ID.",
      });
    }

    const movie = await Movie.findById(movieId).select(
      "title averageRating ratingCount",
    );

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found.",
      });
    }

    const ratings = await Rating.find({
      movie: movieId,
    })
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      movie,
      count: ratings.length,
      ratings,
    });
  } catch (error) {
    console.error("Get ratings error:", error);

    return res.status(500).json({
      message: "Server error while fetching ratings.",
    });
  }
};

// DELETE MY RATING
export const deleteRating = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({
        message: "Invalid movie ID.",
      });
    }

    const rating = await Rating.findOneAndDelete({
      user: req.user._id,
      movie: movieId,
    });

    if (!rating) {
      return res.status(404).json({
        message: "Rating not found.",
      });
    }

    await updateMovieRating(movieId);

    return res.status(200).json({
      message: "Rating deleted successfully.",
    });
  } catch (error) {
    console.error("Delete rating error:", error);

    return res.status(500).json({
      message: "Server error while deleting rating.",
    });
  }
};
