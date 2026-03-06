const db = require('../../db/index');

// Function to fetch all posts from the database
async function getPosts() {
  const query = 'SELECT * FROM posts ORDER BY created_at DESC';
  try {
    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error('DB error fetching posts:', error);
    throw error;
  }
}

module.exports = {
  getPosts,
};
