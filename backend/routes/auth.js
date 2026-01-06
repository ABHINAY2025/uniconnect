import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();



router.get("/check", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      authenticated: true,
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",      // MUST MATCH LOGIN
  });
  res.json({ message: "Logged out" });
});

router.post("/login", async (req, res) => {
  const { rollNo, password } = req.body;

  const user = await User.findOne({ rollNo });
  console.log("User from DB:", user);

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("Password match:", isMatch);


  const token = jwt.sign(
    { id: user._id, rollNo: user.rollNo },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  res.json({ message: "Login successful" });
});

export default router;
