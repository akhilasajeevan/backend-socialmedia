const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Adjust the path as needed

// router.post("/register", async (req, res) => {
//     try {
//       let user = await User.findOne({ email: req.body.email });
//       if (user) return res.status(409).json({ msg: "User already exists." });

//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(req.body.password, salt);

//       // Create User
//       const newUser = await User.create({
//         name: req.body.name,
//         email: req.body.email,
//         password: hashedPassword,
//         bio: req.body.bio, // Include if needed
//       });

//       res.status(201).json({ message: "Registration successful", user: newUser });
//     } catch (err) {
//       console.error("Registration error:", err); // Log the error for debugging
//       res.status(500).send("Server error");
//     }
//   });

router.post("/register", async (req, res) => {
  try {
    // Check if email already exists
    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser)
      return res.status(409).json({ msg: "User already exists." });

    // Check if username already exists
    let existingUsername = await User.findOne({ username: req.body.username });
    if (existingUsername)
      return res.status(409).json({ msg: "Username already taken." });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create User
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      username: req.body.username, // Include username
      bio: req.body.bio, // Include if needed
    });

    res.status(201).json({ message: "Registration successful", user: newUser });
  } catch (err) {
    console.error("Registration error:", err); // Log the error for debugging
    res.status(500).send("Server error");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Middleware to verify JWT token
module.exports = function (req, res, next) {
  const token =
    req.header("x-auth-token") ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Attach user info to request
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = router;
