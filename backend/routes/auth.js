const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // For generating reset token
const nodemailer = require("nodemailer"); 

// Signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hash });
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ error: "Email already in use" });
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

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) return res.status(400).json({ error: "Email not found" });
  
    // You can use this token to send via email or just log for now
    const resetToken = crypto.randomBytes(32).toString("hex");
  
    // Save token temporarily in DB (or skip for now)
    user.resetToken = resetToken;
    user.tokenExpiry = Date.now() + 1000 * 60 * 10; // 10 min expiry
    await user.save();
  
    // In real app, send email here — for now, return in response
    res.json({
      message: "Reset token generated. Implement frontend to handle it.",
      resetToken,
    });
  });

  router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    if (!password) return res.status(400).json({ message: 'Password is required' });
  
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      // Find user
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
  
      await user.save();
  
      res.json({ message: 'Password reset successful' });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  });
  
module.exports = router;
