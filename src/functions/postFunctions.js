let models = require('../models');

/**
 * @description funcion que permite traer paginados los post
 * @author Juan Sebastian Vernaza Lopez
 * @date 01/10/2021
 * @return {*}
 */
function getPostsPagination({limit}) {
  return new Promise((resolve, reject) => {
    models.posts
      .findAll({
        offset: 0,
        limit,
        order: [['created_at', 'DESC']],
      })
      .then((clients) => {
        resolve(clients);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

module.exports = {
  getPostsPagination,
};
