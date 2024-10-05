


const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/users/me
// @desc    Get logged-in user's profile
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.user.id).select('-password');
    console.log(user);
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   PUT api/users/me
// @desc    Update user's profile
// @access  Private
router.put('/me', authMiddleware, async (req, res) => {
  const { name, bio, profilePicture } = req.body;

  try {
    let user = await User.findById(req.user.user.id);

    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Update profile fields
    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});



router.get('/search', async (req, res) => {
  try {
    const { name } = req.query; // Get the name from query parameters
    if (!name) {
      return res.status(400).json({ msg: 'Name query parameter is required.' });
    }

    const users = await User.find({ name: { $regex: name, $options: 'i' } }).select('-password');
    res.json(users); // Send back the found users
  } catch (error) {
    console.error('Error searching users:', error.message);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});
module.exports = router;
