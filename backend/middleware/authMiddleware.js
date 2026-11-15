import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  // 1. Get the Authorization header
  const authHeader = req.headers.authorization;

  // 2. Check whether the token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Not authorized. Token missing.",
    });
  }

  // 3. Extract the token
  const token = authHeader.split(" ")[1];

  // 4. Verify the token
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized. Token invalid or expired.",
    });
  }

  // 5. Find the user associated with the token
  const user = await User.findById(decoded.id);

  if (!user) {
    return res.status(401).json({
      message: "User no longer exists.",
    });
  }

  // 6. Attach the user to the request
  req.user = user;

  // 7. Continue to the next middleware or controller
  next();
};

export default protect;
