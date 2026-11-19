import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
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

    value: {
      type: Number,
      required: [true, "Rating value is required"],
      min: [0, "Rating cannot be below 0"],
      max: [10, "Rating cannot exceed 10"],
    },
  },
  {
    timestamps: true,
  },
);

// One rating per user per movie
ratingSchema.index({ user: 1, movie: 1 }, { unique: true });

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
