import Genre from "../models/Genre.js";
import Movie from "../models/Movie.js";
import mongoose from "mongoose";

// CREATE GENRE (Admin)
export const createGenre = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Genre name is required.",
      });
    }

    const normalizedName = name.trim().toLowerCase();

    const existingGenre = await Genre.findOne({ name: normalizedName });

    if (existingGenre) {
      return res.status(409).json({
        message: "Genre already exists.",
      });
    }

    const genre = await Genre.create({ name: normalizedName });

    return res.status(201).json({
      message: "Genre created successfully.",
      genre,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Genre already exists.",
      });
    }

    console.error("Create genre error:", error);

    return res.status(500).json({
      message: "Server error while creating genre.",
    });
  }
};

// GET ALL GENRES (Public)
export const getGenres = async (req, res) => {
  try {
    const genres = await Genre.find().sort({ name: 1 });

    return res.status(200).json({
      count: genres.length,
      genres,
    });
  } catch (error) {
    console.error("Get genres error:", error);

    return res.status(500).json({
      message: "Server error while fetching genres.",
    });
  }
};

// GET SINGLE GENRE (Public)
export const getGenreById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid genre ID.",
      });
    }

    const genre = await Genre.findById(id);

    if (!genre) {
      return res.status(404).json({
        message: "Genre not found.",
      });
    }

    return res.status(200).json({ genre });
  } catch (error) {
    console.error("Get genre error:", error);

    return res.status(500).json({
      message: "Server error while fetching genre.",
    });
  }
};

// UPDATE GENRE (Admin)
export const updateGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid genre ID.",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Genre name is required.",
      });
    }

    const normalizedName = name.trim().toLowerCase();

    const genre = await Genre.findById(id);

    if (!genre) {
      return res.status(404).json({
        message: "Genre not found.",
      });
    }

    const duplicate = await Genre.findOne({
      name: normalizedName,
      _id: { $ne: id },
    });

    if (duplicate) {
      return res.status(409).json({
        message: "Another genre already uses this name.",
      });
    }

    genre.name = normalizedName;
    await genre.save();

    return res.status(200).json({
      message: "Genre updated successfully.",
      genre,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Genre already exists.",
      });
    }

    console.error("Update genre error:", error);

    return res.status(500).json({
      message: "Server error while updating genre.",
    });
  }
};

// DELETE GENRE (Admin)
export const deleteGenre = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid genre ID.",
      });
    }

    const genre = await Genre.findById(id);

    if (!genre) {
      return res.status(404).json({
        message: "Genre not found.",
      });
    }

    const moviesUsingGenre = await Movie.exists({
      genres: id,
    });

    if (moviesUsingGenre) {
      return res.status(409).json({
        message: "Cannot delete genre because movies are using it.",
      });
    }

    await genre.deleteOne();

    return res.status(200).json({
      message: "Genre deleted successfully.",
    });
  } catch (error) {
    console.error("Delete genre error:", error);

    return res.status(500).json({
      message: "Server error while deleting genre.",
    });
  }
};
