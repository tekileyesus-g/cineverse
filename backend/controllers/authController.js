import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

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

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password.",
      });
    }

    // 2. Find user and explicitly retrieve password
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // 3. Verify password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // 4. Generate JWT
    const token = generateToken(user._id);

    // 5. Return token and safe user information
    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error during login.",
    });
  }
};
