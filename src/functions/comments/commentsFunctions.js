// let models = require('../db ');
const postgresDB = require('../../db/postgresDB');
const { getPostDetail } = require('../posts/postFunctions');

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
    comments
      .create({
        post_id,
        name,
        content,
        user_email,
        created_at: new Date(),
      })
      .then(async (success) => {
        let event = await getPostDetail({ post_id, session_user_email: user_email }).catch((e) => {
          reject({ error: true });
        });
        resolve(event);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

module.exports = {
  createNewComments,
};
