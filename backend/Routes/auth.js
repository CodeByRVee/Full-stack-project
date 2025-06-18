const express = require('express');
const routes = express.Router();
const bcrypt = require('bcrypt');
const auth = require("../Models/auth");
const jwt = require('jsonwebtoken');
const authenticateToken = require("../mddilewares/jwt");
require('dotenv').config();


// Register Route
routes.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await auth.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new auth({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });  

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error during registration' });
  }
});
// Login Route
routes.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await auth.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Incorrect Username' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect Password' });
    }

    const payload = { id: user._id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
     res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "strict"
    });
    res.status(200).json({ token ,payload ,message: 'Login successful' });
     


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error during login' });
  }
});

// Protected Route
routes.get("/profile", authenticateToken, async (req, res) => {
  try {
    req
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    res.json({
      message: "Protected data accessed",
      userId: req.user.id,
      username: req.user.username,
      user: req.user,
    });
  } catch (err) {
    console.error("Profile route error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//forgot password
routes.post('/forgot-password', async (req, res) => {
  const { username } = req.body;

  try {
    const user = await auth.findOneAndUpdate({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Password reset link sent ' });


  } catch (error) { 
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }   
})

module.exports = routes;