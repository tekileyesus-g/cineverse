
import mongoose from "mongoose";
import Review from "../models/Review.js";
import Movie from "../models/Movie.js";

// CREATE REVIEW
export const createReview = async (req, res) => {
  try {
    const { movieId, content } = req.body;

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({
        message: "Invalid movie ID.",
      });
    }

    if (
      typeof content !== "string" ||
      content.trim().length < 5 ||
      content.trim().length > 2000
    ) {
      return res.status(400).json({
        message: "Review must contain 5 to 2000 characters.",
      });
    }

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found.",
      });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      movie: movieId,
    });

    if (existingReview) {
      return res.status(409).json({
        message: "You have already reviewed this movie.",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      movie: movieId,
      content: content.trim(),
    });

    await review.populate("user", "username profilePicture");

    return res.status(201).json({
      message: "Review created successfully.",
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already reviewed this movie.",
      });
    }

    console.error("Create review error:", error);

    return res.status(500).json({
      message: "Server error while creating review.",
    });
  }
};

// GET REVIEWS FOR A MOVIE
export const getMovieReviews = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({
        message: "Invalid movie ID.",
      });
    }

    const movieExists = await Movie.exists({ _id: movieId });

    if (!movieExists) {
      return res.status(404).json({
        message: "Movie not found.",
      });
    }

    const reviews = await Review.find({
      movie: movieId,
    })
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    return res.status(500).json({
      message: "Server error while fetching reviews.",
    });
  }
};

// UPDATE MY REVIEW
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { content } = req.body;

    if (!mongoose.isValidObjectId(reviewId)) {
      return res.status(400).json({
        message: "Invalid review ID.",
      });
    }

    if (
      typeof content !== "string" ||
      content.trim().length < 5 ||
      content.trim().length > 2000
    ) {
      return res.status(400).json({
        message: "Review must contain 5 to 2000 characters.",
      });
    }

    const review = await Review.findOneAndUpdate(
      {
        _id: reviewId,
        user: req.user._id,
      },
      {
        content: content.trim(),
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "username profilePicture");

    if (!review) {
      return res.status(404).json({
        message: "Review not found or you do not own this review.",
      });
    }

    return res.status(200).json({
      message: "Review updated successfully.",
      review,
    });
  } catch (error) {
    console.error("Update review error:", error);

    return res.status(500).json({
      message: "Server error while updating review.",
    });
  }
};

// DELETE MY REVIEW
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.isValidObjectId(reviewId)) {
      return res.status(400).json({
        message: "Invalid review ID.",
      });
    }

    const review = await Review.findOneAndDelete({
      _id: reviewId,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found or you do not own this review.",
      });
    }

    return res.status(200).json({
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Delete review error:", error);

    return res.status(500).json({
      message: "Server error while deleting review.",
    });
  }
};

// GET MY REVIEWS
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      user: req.user._id,
    })
      .populate("movie", "title poster releaseYear")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get my reviews error:", error);

    return res.status(500).json({
      message: "Server error while fetching your reviews.",
    });
  }
};
