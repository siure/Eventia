import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add userId to request for controllers to use
    req.userId = decoded.userId;

    next(); // Continue to controller
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
