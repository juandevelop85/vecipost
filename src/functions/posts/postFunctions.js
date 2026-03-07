const postgresDB = require('../../db/postgresDB');

/**
 * @description Get paginated posts with aggregated likes, dislikes and comments
 * @author Juan Sebastian Vernaza Lopez
 * @date 01/10/2021
 * @param {Object} params
 * @param {number} params.limit - Number of posts per page
 * @param {number} params.page - Page number (0 indexed)
 * @param {string} params.session_user_email - Current user email for user-specific like/dislike
 * @return {Promise<Array>} Resolves to array of post objects with aggregated data
 */
function getPostsPagination({ limit, page, session_user_email }) {
  return new Promise((resolve, reject) => {
    const posts = postgresDB.default.instance.db.posts;
    const posts_comments = postgresDB.default.instance.db.posts_comments;
    const sequelize = postgresDB.default.instance.db.sequelize;

    // Validate and sanitize inputs
    const lim = Number(limit);
    const pg = Number(page);
    if (isNaN(lim) || lim <= 0) {
      return reject(new Error('Invalid limit parameter')); 
    }
    if (isNaN(pg) || pg < 0) {
      return reject(new Error('Invalid page parameter'));
    }

    const offset = pg * lim;

    posts
      .findAll({
        attributes: {
          include: [
            [
              sequelize.literal(`(
                SELECT COUNT(*)
                FROM posts_events AS posts_events
                WHERE posts_events.post_id = posts.id
                AND posts_events.like = true
              )`),
              'like_count',
            ],
            [
              sequelize.literal(`(
                SELECT COUNT(*)
                FROM posts_events AS posts_events
                WHERE posts_events.post_id = posts.id
                AND posts_events.dislike = true
              )`),
              'dislike_count',
            ],
            [
              sequelize.literal(`(
                SELECT 1
                FROM posts_events AS posts_events
                WHERE posts_events.post_id = posts.id
                AND posts_events.like = true
                AND posts_events.user_email = '${session_user_email}'
              )`),
              'u_like_count',
            ],
            [
              sequelize.literal(`(
                SELECT 1
                FROM posts_events AS posts_events
                WHERE posts_events.post_id = posts.id
                AND posts_events.dislike = true
                AND posts_events.user_email = '${session_user_email}'
              )`),
              'u_dislike_count',
            ],
          ],
        },
        include: [
          {
            model: posts_comments,
          },
        ],
        offset: offset,
        limit: lim,
        order: [['created_at', 'DESC']],
        plain: false,
        nest: true,
      })
      .then((posts) => {
        resolve(posts);
      })
      .catch((e) => {
        console.error(e);
        reject(e);
      });
  });
}

module.exports = {
  getPostsPagination,
};
