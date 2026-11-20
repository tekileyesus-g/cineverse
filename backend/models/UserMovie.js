import mongoose from "mongoose";

const userMovieSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    status: {
      type: String,
      enum: ["watchlist", "watched"],
      required: true,
      default: "watchlist",
    },

    watchedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// A movie can appear only once per user's collection
userMovieSchema.index({ user: 1, movie: 1 }, { unique: true });

userMovieSchema.index({ user: 1, status: 1, createdAt: -1 });

const UserMovie = mongoose.model("UserMovie", userMovieSchema);

export default UserMovie;
