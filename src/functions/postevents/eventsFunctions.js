const postgresDB = require('../../db/postgresDB');
const { getPostDetail } = require('../posts/postFunctions');

/**
 * @description Funcion para añadir un like a un post, si el usuario ya realizo un evento sobre el post
 * @author Juan Sebastian Vernaza Lopez
 * @date 06/10/2021
 * @return {*}
 */
function updateEventPost({ post_id, isLike, session_user_email }) {
  return new Promise(async (resolve, reject) => {
    let event = null;

    if (isLike === null) {
      await clearUserElection(post_id, session_user_email).catch((e) => {
        reject({ error: true });
      });
    } else {
      await addLikeToPost(post_id, isLike, session_user_email).catch((e) => {
        reject({ error: true });
      });
    }
    //Obtiene el detalle del post una vez se realizaron las actualzaciones pertinentes
    event = await getPostDetail({ post_id, session_user_email }).catch((e) => {
      reject({ error: true });
    });

    resolve(event);
  });
}

/**
 * @description Funcion de apoyo para cuando el usuario quita un like o dislike que habia dado anteriormente
 * @author Juan Sebastian Vernaza Lopez
 * @date 06/10/2021
 * @param {*} post_id
 * @param {*} session_user_email
 * @return {*}
 */
function clearUserElection(post_id, session_user_email) {
  return new Promise(async (resolve, reject) => {
    let posts_events = postgresDB.default.instance.db.posts_events;
    posts_events
      .update(
        {
          like: 0,
          dislike: 0,
        },
        {
          where: { post_id, user_email: session_user_email },
          returning: true,
        }
      )
      .then(async ([updated, model]) => {
        if (updated) {
          resolve(model[0]);
        } else {
          reject({ message: 'No se ha realizado ninguna actualización' });
        }
      })
      .catch((e) => {
        reject({ error: true });
      });
  });
}

/**
 * @description Funcion de apoyo para gestionar un like o dislike cuando se da el evento por parte del usuario
 * @author Juan Sebastian Vernaza Lopez
 * @date 06/10/2021
 * @param {*} post_id
 * @param {*} isLike
 * @param {*} session_user_email
 * @return {*}
 */
function addLikeToPost(post_id, isLike, session_user_email) {
  return new Promise((resolve, reject) => {
    let posts_events = postgresDB.default.instance.db.posts_events;
    posts_events
      .findOrCreate({
        where: {
          post_id,
          user_email: session_user_email,
        },
        defaults: {
          like: isLike ? 1 : 0,
          dislike: !isLike ? 1 : 0,
        },
      })
      .then(async ([client, created]) => {
        if (!created) {
          client.like = isLike ? 1 : 0;
          client.dislike = !isLike ? 1 : 0;
          await client.save();
        }
        resolve(client);
      })
      .catch((e) => {
        reject({ error: true });
      });
  });
}

module.exports = {
  updateEventPost,
};
