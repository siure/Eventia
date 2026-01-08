import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Optional auth - sets userId if token is valid, but doesn't require it
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
      } catch (error) {
        // Invalid token, but continue without userId
        req.userId = undefined;
      }
    }

    next();
  } catch (error) {
    next();
  }
};
