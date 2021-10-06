// let models = require('../db ');
const postgresDB = require('../../db/postgresDB');

/**
 * @description Obtiene un post por id
 * @author Juan Sebastian Vernaza Lopez
 * @date 02/10/2021
 * @param {*} { post_id }
 * @return {*}
 */
function getPostComments({ post_id, session_user_email }) {
  return new Promise((resolve, reject) => {
    let posts = postgresDB.default.instance.db.posts;
    let posts_comments = postgresDB.default.instance.db.posts_comments;
    const sequelize = postgresDB.default.instance.db.sequelize;

    posts
      .findAll({
        where: { id: post_id },
        attributes: {
          include: [
            [
              sequelize.literal(`(
                SELECT COUNT(*)
                FROM posts_events AS posts_events
                WHERE posts_events.post_id = posts.id
                AND posts_events.like = 1
            )`),
              'like_count',
            ],
            [
              sequelize.literal(`(
                SELECT COUNT(*)
                FROM posts_events AS posts_events
                WHERE posts_events.post_id = posts.id
                AND posts_events.dislike = 1
            )`),
              'dislike_count',
            ],
            [
              sequelize.literal(`(
                SELECT 1
                FROM posts_events AS posts_events
                WHERE posts_events.post_id = posts.id
                AND posts_events.like = 1
                AND posts_events.user_email = '${session_user_email}'
            )`),
              'u_like_count',
            ],
            [
              sequelize.literal(`(
                SELECT 1
                FROM posts_events AS posts_events
                WHERE posts_events.post_id = posts.id
                AND posts_events.dislike = 1
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
        plain: false,
        nest: true,
      })
      .then((posts) => {
        resolve(posts);
      })
      .catch((e) => {
        console.log(e);
        reject(e);
      });
  });
}

/**
 * @description Crea un nuevo comentario para un post publico en la BD
 * @author Juan Sebastian Vernaza Lopez
 * @date 02/10/2021
 * @param {*} {post_id, name, content, user_email}
 * @return {*}
 */
function createNewComments({ post_id, name, content, user_email }) {
  return new Promise((resolve, reject) => {
    let comments = postgresDB.default.instance.db.posts_comments;
    //models.comments
    comments
      .create({
        post_id,
        name,
        content,
        user_email,
        created_at: new Date(),
      })
      .then(async (success) => {
        resolve(success);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

module.exports = {
  getPostComments,
  createNewComments,
};
