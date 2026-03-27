const express = require('express');
const router = express.Router();
const postsHandlers = require('../../handlers/posts/postsHandlers');

// GET /posts - fetch all posts
router.get('/', postsHandlers.getPosts);

module.exports = router;
