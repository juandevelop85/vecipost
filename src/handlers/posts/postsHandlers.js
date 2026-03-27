const postFunctions = require('../../functions/posts/postFunctions');

// Handler to get all posts
async function getPosts(req, res) {
  try {
    const posts = await postFunctions.getPosts();
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch posts' });
  }
}

module.exports = {
  getPosts,
};
