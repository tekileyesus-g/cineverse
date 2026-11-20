import mongoose from "mongoose";
import User from "../models/User.js";

// GET MY PROFILE
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -__v");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      message: "Server error while fetching profile.",
    });
  }
};

// UPDATE MY PROFILE
export const updateMyProfile = async (req, res) => {
  try {
    const { username, bio, profilePicture } = req.body;

    const updates = {};

    if (username !== undefined) {
      if (
        typeof username !== "string" ||
        username.trim().length < 3 ||
        username.trim().length > 30
      ) {
        return res.status(400).json({
          message: "Username must contain 3 to 30 characters.",
        });
      }

      updates.username = username.trim();
    }

    if (bio !== undefined) {
      if (typeof bio !== "string" || bio.length > 300) {
        return res.status(400).json({
          message: "Bio must be a string of at most 300 characters.",
        });
      }

      updates.bio = bio.trim();
    }

    if (profilePicture !== undefined) {
      if (typeof profilePicture !== "string" || profilePicture.length > 2048) {
        return res.status(400).json({
          message: "Invalid profile picture value.",
        });
      }

      updates.profilePicture = profilePicture.trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid profile fields provided.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password -__v");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Username is already taken.",
      });
    }

    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Server error while updating profile.",
    });
  }
};

// GET PUBLIC PROFILE BY USERNAME
export const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({
      username,
    }).select("username profilePicture bio createdAt");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get public profile error:", error);

    return res.status(500).json({
      message: "Server error while fetching public profile.",
    });
  }
};
