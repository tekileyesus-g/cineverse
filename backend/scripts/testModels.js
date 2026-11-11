import connectDB from "../config/db.js";
import Genre from "../models/Genre.js";
import Movie from "../models/Movie.js";

const testModels = async () => {
  try {
    await connectDB();

    // Find or create a genre
    const genre = await Genre.findOneAndUpdate(
      { name: "action" },
      { $setOnInsert: { name: "action" } },
      { returnDocument: "after", upsert: true },
    );

    // Create a movie
    const movie = await Movie.create({
      title: "Test Movie",
      description: "Testing our CineVerse movie model.",
      releaseYear: 2026,
      director: "Test Director",
      genres: [genre._id],
    });

    // Retrieve movie with populated genres
    const result = await Movie.findById(movie._id).populate("genres");

    console.log("Movie created successfully:");
    console.log(result);

    process.exit(0);
  } catch (error) {
    console.error("Model test failed:", error);
    process.exit(1);
  }
};

testModels();
