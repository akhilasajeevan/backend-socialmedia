// // // models/Post.js
// // const mongoose = require('mongoose');

// // const PostSchema = new mongoose.Schema({
// //   content: {
// //     type: String,
// //     required: true,
// //   },
// //   user: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'User', // Reference to the User model
// //     required: true,
// //   },
// // }, { timestamps: true });

// // module.exports = mongoose.model('Post', PostSchema);


// const mongoose = require('mongoose');

// const PostSchema = new mongoose.Schema({
//   content: {
//     type: String,
//     required: true,
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // Reference to the User model
//     required: true,
//   },
//   likes: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User' // Reference to the User model for likes
//   }],
// }, { timestamps: true });

// module.exports = mongoose.model('Post', PostSchema);


const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // References users who liked the post
  }],
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
