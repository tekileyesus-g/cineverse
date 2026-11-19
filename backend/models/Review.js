import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
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

    content: {
      type: String,
      required: [true, "Review content is required"],
      trim: true,
      minlength: [5, "Review must contain at least 5 characters"],
      maxlength: [2000, "Review cannot exceed 2000 characters"],
    },
  },
  {
    timestamps: true,
  },
);

// One review per user per movie
reviewSchema.index({ user: 1, movie: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
