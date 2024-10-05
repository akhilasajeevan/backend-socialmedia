




// // server/routes/posts.js

// const express = require('express');
// const router = express.Router();
// const Post = require('../models/Post'); // Adjust the path to your Post model
// const authMiddleware = require('../middleware/auth'); // Import your auth middleware
// const { verifyToken } = require('../middleware/auth');
// // Route to create a post
// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     const { content } = req.body;
//     console.log('Request Body:', req.body);
//     console.log('Authenticated User:', req.user);

//     if (!content) {
//       return res.status(400).json({ msg: 'Content is required.' });
//     }

//     const userId = req.user.user.id;
//     if (!userId) {
//       return res.status(400).json({ msg: 'User ID is required.' });
//     }

//     const newPost = new Post({
//       content,
//       user: userId,
//     });

//     const savedPost = await newPost.save();
//     res.status(201).json(savedPost);
//   } catch (error) {
//     console.error('Error saving post:', error);
//     res.status(500).json({ msg: 'Server error', error: error.message });
//   }
// });

// // Route to fetch all posts
// router.get('/', async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate('user') // Fetch and populate user details
//       .sort({ createdAt: -1 }); // Sort by createdAt in descending order
//     res.status(200).json(posts);
//   } catch (error) {
//     console.error('Error fetching posts:', error.message);
//     res.status(500).json({ msg: 'Server error', error: error.message });
//   }
// });

// // Route to like/unlike a post
// router.put('/:id/like', authMiddleware, async (req, res) => {
//   try {
//     const postId = req.params.id; // Get post ID from the URL
//     const userId = req.user.user.id; // Get user ID from the token

//     // Find the post by ID
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ msg: 'Post not found' });
//     }

//     // Check if userId already liked the post
//     if (post.likes.includes(userId)) {
//       // User has already liked the post; remove like
//       post.likes = post.likes.filter((id) => id.toString() !== userId);
//     } else {
//       // User has not liked the post; add like
//       post.likes.push(userId);
//     }

//     // Save the updated post
//     const updatedPost = await post.save();
//     res.json({ likes: updatedPost.likes }); // Respond with the updated likes array
//   } catch (error) {
//     console.error('Error liking/unliking post:', error);
//     res.status(500).json({ msg: 'Server error', error: error.message });
//   }
// });


// // router.get('/user/me', verifyToken, async (req, res) => {
// //   try {
// //     const posts = await Post.find({ author: req.user.id }).sort({
// //       createdAt: -1,
// //     });
// //     res.json(posts);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error fetching posts' });
// //   }
// // });

// module.exports = router;


const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

// @route   POST api/posts
// @desc    Create a new post
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { content } = req.body;

  try {
    if (!content) return res.status(400).json({ msg: 'Content is required.' });

    const newPost = new Post({
      content,
      user: req.user.user.id, // Assign the authenticated user's ID
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name profilePicture').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   PUT api/posts/:id/like
// @desc    Like/Unlike a post
// @access  Private
router.put('/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const userId = req.user.user.id;

    if (post.likes.includes(userId)) {
      // Unlike
      post.likes = post.likes.filter((like) => like.toString() !== userId);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});








// Route to fetch posts created by the authenticated user
router.get('/user/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.user.id; // Assuming req.user contains the authenticated user data
    const posts = await Post.find({ user: userId }).populate('user').sort({ createdAt: -1 }); // Fetch user's posts
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error.message);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});



module.exports = router;
