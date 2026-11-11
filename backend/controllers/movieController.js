import mongoose from "mongoose";
import Movie from "../models/Movie.js";
import Genre from "../models/Genre.js";

// CREATE MOVIE
export const createMovie = async (req, res) => {
  try {
    const { title, description, releaseYear, poster, director, genres } =
      req.body;

    // Validate genres
    if (genres !== undefined && !Array.isArray(genres)) {
      return res.status(400).json({
        message: "Genres must be an array",
      });
    }

    const genreIds = [...new Set(genres || [])];

    for (const id of genreIds) {
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          message: `Invalid genre ID: ${id}`,
        });
      }
    }

    // Check whether genres exist
    const existingGenres = await Genre.find({
      _id: { $in: genreIds },
    });

    if (existingGenres.length !== genreIds.length) {
      return res.status(400).json({
        message: "One or more genres do not exist",
      });
    }

    // Create movie
    const movie = await Movie.create({
      title,
      description,
      releaseYear,
      poster,
      director,
      genres: genreIds,
    });

    return res.status(201).json({
      message: "Movie created successfully",
      movie,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create movie",
      error: error.message,
    });
  }
};

// GET ALL MOVIES
export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find()
      .populate("genres")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: movies.length,
      movies,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve movies",
      error: error.message,
    });
  }
};

// GET SINGLE MOVIE
export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid movie ID",
      });
    }

    const movie = await Movie.findById(id).populate("genres");

    // Check if movie exists
    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    return res.status(200).json({
      movie,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve movie",
      error: error.message,
    });
  }
};

// UPDATE MOVIE
export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid movie ID",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "releaseYear",
      "poster",
      "director",
      "genres",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.genres !== undefined) {
      if (!Array.isArray(updates.genres)) {
        return res.status(400).json({
          message: "Genres must be an array",
        });
      }

      updates.genres = [...new Set(updates.genres)];

      for (const genreId of updates.genres) {
        if (!mongoose.isValidObjectId(genreId)) {
          return res.status(400).json({
            message: `Invalid genre ID: ${genreId}`,
          });
        }
      }

      const existingGenres = await Genre.find({
        _id: { $in: updates.genres },
      });

      if (existingGenres.length !== updates.genres.length) {
        return res.status(400).json({
          message: "One or more genres do not exist",
        });
      }
    }

    const movie = await Movie.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).populate("genres");

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    return res.status(200).json({
      message: "Movie updated successfully",
      movie,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update movie",
      error: error.message,
    });
  }
};

// DELETE MOVIE
export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid movie ID",
      });
    }

    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    return res.status(200).json({
      message: "Movie deleted successfully",
      movie,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete movie",
      error: error.message,
    });
  }
};
