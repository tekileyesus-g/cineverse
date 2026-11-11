import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Movie title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Movie description is required"],
      trim: true,
    },

    releaseYear: {
      type: Number,
      required: [true, "Release year is required"],
    },

    poster: {
      type: String,
      default: "",
    },

    director: {
      type: String,
      required: [true, "Director is required"],
      trim: true,
    },

    genres: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],

    averageRating: {
      type: Number,
      default: null,
      min: 0,
      max: 10,
    },

    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
