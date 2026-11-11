
import mongoose from "mongoose";

const genreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Genre name is required"],
      unique: true,
      trim: true,
      lowercase: true
    }
  },
  {
    timestamps: true
  }
);

const Genre = mongoose.model("Genre", genreSchema);

export default Genre;
