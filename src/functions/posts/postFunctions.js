const postgresDB = require('../../db/postgresDB');

/**
 * @description Import project data (posts, comments, events) into the database.
 * Uses a transaction to ensure atomicity.
 * Validates input structure before processing.
 * @param {Object} importData - The project data to import.
 * @param {Array} importData.posts - Array of post objects.
 * @param {Array} importData.posts_comments - Array of comment objects.
 * @param {Array} importData.posts_events - Array of event objects.
 * @returns {Promise<Object>} - Import summary with counts or error.
 */
async function importProjectData(importData) {
  const { posts, posts_comments, posts_events } = importData;

  if (!Array.isArray(posts) || !Array.isArray(posts_comments) || !Array.isArray(posts_events)) {
    throw new Error('Invalid import data format; posts, posts_comments, and posts_events must be arrays.');
  }

  const db = postgresDB.default.instance.db;
  const sequelize = db.sequelize;

  const PostsModel = db.posts;
  const CommentsModel = db.posts_comments;
  const EventsModel = db.posts_events;

  let transaction;

  try {
    transaction = await sequelize.transaction();

    // Bulk insert posts
    const createdPosts = await PostsModel.bulkCreate(posts, { transaction, returning: true });

    // We need to map old post ids to new post ids if the import data has ids to maintain relationships
    // Assuming imported posts have 'id' field which is primary key from source
    // Map old post id to new post id
    const postIdMap = new Map();
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].id && createdPosts[i]) {
        postIdMap.set(posts[i].id, createdPosts[i].id);
      }
    }

    // Prepare comments with updated post_id
    const preparedComments = posts_comments.map(comment => {
      let mappedPostId = comment.post_id && postIdMap.has(comment.post_id) ? postIdMap.get(comment.post_id) : null;
      return {
        name: comment.name,
        content: comment.content,
        user_email: comment.user_email,
        post_id: mappedPostId
      };
    }).filter(c => c.post_id !== null); // filter out comments for posts not imported

    // Bulk insert comments
    await CommentsModel.bulkCreate(preparedComments, { transaction });

    // Prepare events with updated post_id
    const preparedEvents = posts_events.map(event => {
      let mappedPostId = event.post_id && postIdMap.has(event.post_id) ? postIdMap.get(event.post_id) : null;
      return {
        user_email: event.user_email,
        like: event.like || 0,
        dislike: event.dislike || 0,
        post_id: mappedPostId
      };
    }).filter(e => e.post_id !== null); // filter out events for posts not imported

    // Bulk insert events
    await EventsModel.bulkCreate(preparedEvents, { transaction });

    await transaction.commit();

    return {
      success: true,
      message: 'Import completed successfully.',
      counts: {
        posts: createdPosts.length,
        comments: preparedComments.length,
        events: preparedEvents.length
      }
    };
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
}

module.exports = {
  importProjectData
};
