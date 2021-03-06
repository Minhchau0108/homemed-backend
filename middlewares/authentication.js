const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const User = require("../models/User");

const authMiddleware = {};

authMiddleware.loginRequired = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) return next(new Error("401 - Access Token required"));
    const token = tokenString.replace("Bearer ", "");

    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return next(new Error("401 - Token expired"));
        } else {
          console.log("error", err);
          return next(new Error("401 - Token is invalid"));
        }
      }

      req.userId = payload._id;
    });
    next();
  } catch (error) {
    next(error);
  }
};

authMiddleware.adminRequired = async (req, res, next) => {
  try {
    const userId = req.userId;
    const currentUser = await User.findById(userId);
    const isAdmin = currentUser.role === "admin";

    if (!isAdmin) return next(new Error("401- Admin required"));
    req.isAdmin = isAdmin;

    next();
  } catch (error) {
    next(error);
  }
};

authMiddleware.doctorRequired = async (req, res, next) => {
  try {
    const userId = req.userId;
    const currentUser = await User.findById(userId);
    const isDoctor = currentUser.role === "doctor";

    if (!isDoctor) return next(new Error("401- Doctor required"));
    req.isDoctor = isDoctor;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
