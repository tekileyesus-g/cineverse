import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";

const testUser = async () => {
  try {
    await connectDB();

    // Create a test user
    const user = await User.create({
      username: "test_user",
      email: `test${Date.now()}@example.com`,
      password: "mypassword123",
    });

    console.log("User created successfully!");

    // Check whether the password was hashed
    console.log("Password hashed:", user.password !== "mypassword123");

    // Test correct password
    const correctPassword = await user.comparePassword("mypassword123");

    console.log("Correct password:", correctPassword);

    // Test incorrect password
    const wrongPassword = await user.comparePassword("wrongpassword");

    console.log("Wrong password:", wrongPassword);

    // Delete test user
    await User.findByIdAndDelete(user._id);

    console.log("Test user deleted successfully!");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await mongoose.disconnect();
  }
};

testUser();
