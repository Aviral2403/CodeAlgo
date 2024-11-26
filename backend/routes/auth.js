const express = require("express");
const { signup, login, logout, verifyEmail, forgotPassword ,resetPassword ,checkAuth } = require("../controllers/auth.controller");
const verifyToken = require("../middleware/verifyToken")

const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


router.get("/check-auth" , verifyToken , checkAuth)

module.exports = router;