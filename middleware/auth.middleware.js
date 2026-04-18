const jwt = require("jsonwebtoken");
const User = require("../models/user.models");

exports.authenticate = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization || "";

    if (!authorization.startsWith("Bearer")) {
      return res.status(401).json({
        status: false,
        message: "Authorization token is required",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        status: false,
        message: "JWT_SECRET is not configured",
      });
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Invalid authentication token",
      });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Invalid or expired authentication token",
    });
  }
};

exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission",
      });
    }

    next();
  };
};
