const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // For generating reset token
const nodemailer = require("nodemailer"); 

// Signup
// Signup
router.post("/signup", async (req, res) => {
  const { name, email, password , role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hash , role });
    console.log("User created successfully:", user); // ✅ Debugging
    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error("Signup error:", err); // ✅ Print the real error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ error: "Email already in use" });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
});


// Signin
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
});

  
module.exports = router;
