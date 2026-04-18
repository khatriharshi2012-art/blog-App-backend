const User = require("../models/user.models")

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password ,role} = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "name , email , password are required fields",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({
        status: false,
        message: "User already exists with this email",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role
    });

    const token = newUser.generateAccessToken();

    return res.status(201).json({
      status: true,
      message: "user created successfully",
      data: {
        user: buildUserResponse(newUser),
        token,
      },
    });
  } catch (error) {
    console.log("createUser error:", error);

    return res.status(500).json({
      status: false,
      message: error?.message || "Internal server error",
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "email and password are required fields",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = user.generateAccessToken();

    return res.status(200).json({
      status: true,
      message: "login successful",
      data: {
        user: buildUserResponse(user),
        accessToken,
      },
    });
  } catch (error) {
    console.log("loginUser error:", error);

    return res.status(500).json({
      status: false,
      message: error?.message || "Internal server error",
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {

    const {id} = req.body

    const user = await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message : "User deleted succesffully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
