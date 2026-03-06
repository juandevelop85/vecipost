const db = require('../../db/index');

// Function to fetch all posts
async function fetchAllPosts() {
  const query = 'SELECT id, title, content, created_at FROM posts ORDER BY created_at DESC';
  const result = await db.query(query);
  return result.rows;
}

// Function to add a new post
async function addPost({ title, content }) {
  const query = 'INSERT INTO posts (title, content, created_at) VALUES ($1, $2, NOW()) RETURNING id, title, content, created_at';
  const values = [title, content];
  const result = await db.query(query, values);
  return result.rows[0];
}

module.exports = {
  fetchAllPosts,
  addPost,
};
