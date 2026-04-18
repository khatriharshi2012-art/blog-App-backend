const express = require("express");
const { registerUser, loginUser, getMe , deleteUser } = require("../controllers/user.controllers");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authenticate, getMe);
router.post("/delete-user", authenticate, deleteUser);


module.exports = router ;
