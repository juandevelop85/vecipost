let models = require('../models');

/**
 * @description funcion que permite traer paginados los post
 * @author Juan Sebastian Vernaza Lopez
 * @date 01/10/2021
 * @return {*}
 */
function getPostsPagination({ limit, page }) {
  return new Promise((resolve, reject) => {
    models.posts
      .findAll({
        include: [
          {
            model: models.posts_comments,
          },
        ],
        offset: page * limit,
        limit,
        order: [['created_at', 'DESC']],
        plain: false,
        nest: true,
      })
      .then((posts) => {
        resolve(posts);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

/**
 * @description Crea un nuevo post en la BD
 * @author Juan Sebastian Vernaza Lopez
 * @date 02/10/2021
 * @param {*} {name, content, user_email}
 * @return {*}
 */
function createNewPosts({ name, content, user_email }) {
  return new Promise((resolve, reject) => {
    models.posts
      .create({
        name,
        content,
        user_email,
        likes: 0,
        dislikes: 0,
        created_at: new Date()
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
  getPostsPagination,
  createNewPosts,
};
