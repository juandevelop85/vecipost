const newPostsFunction = require('../../functions/posts/newPostsFunction');

// Handler for GET /posts
async function getAllPosts(req, res) {
  try {
    const posts = await newPostsFunction.fetchAllPosts();
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve posts' });
  }
}

// Handler for POST /posts
async function createPost(req, res) {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }
    const newPost = await newPostsFunction.addPost({ title, content });
    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create post' });
  }
}

module.exports = {
  getAllPosts,
  createPost,
};
