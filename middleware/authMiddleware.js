import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// ✅ Middleware: Protect routes (verify token)
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};

// ✅ Middleware: Allow only admin
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.email === "eduprayashub@gmail.com") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
};