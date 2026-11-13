import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    // 1. Get registration details
    const { username, email, password } = req.body;

    // 2. Check required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please provide username, email, and password.",
      });
    }

    // 3. Check whether username or email already exists
    const existingUser = await User.findOne({
      $or: [
        { username: username.trim().toLowerCase() },
        { email: email.trim().toLowerCase() },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username or email is already taken.",
      });
    }

    // 4. Create the user
    const user = await User.create({
      username,
      email,
      password,
    });

    // 5. Return safe user information
    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        bio: user.bio,
      },
    });
  } catch (error) {
    // Handle duplicate-key errors (unique indexes)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Username or email is already taken.",
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Server error during registration.",
    });
  }
};
