const express = require('express');
const router = express.Router();
const newPostsHandler = require('../../handlers/posts/newPostsHandler');

// GET /posts - get all posts
router.get('/', newPostsHandler.getAllPosts);

// POST /posts - create a new post
router.post('/', newPostsHandler.createPost);

module.exports = router;
