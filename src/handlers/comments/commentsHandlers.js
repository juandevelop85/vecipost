const { createNewComments } = require('../../functions/comments/commentsFunctions');
const { getPostDetail } = require('../../functions/posts/postFunctions');

/**
 * @description Handler para retorna los Comment paginados.
 * @author Juan Sebastian Vernaza Lopez
 * @date 01/10/2021
 * @param {*} req
 * @param {*} res
 */

//TODO sacar de aqui y llevar al modulo de post
async function getAllPostComments(req, res) {
  try {
    let input = req.params;
    let response = {};

    await getPostDetail(input).then((success) => {
      response = { comments: success, status: 'SUCCESS', error: false };
    });

    res.json(response);
  } catch (e) {
    
    res.status(500).send(
      (respuesta = {
        status: 'ERROR',
        message: 'Error al realizar petición',
        error: true,
      })
    );
  }
}

/**
 * @description Handler crear un Comment.
 * @author Juan Sebastian Vernaza Lopez
 * @date 01/10/2021
 * @param {*} req
 * @param {*} res
 */
async function createPostComment(req, res) {
  try {
    let input = req.body;
    let response = {};

    await createNewComments(input).then((success) => {
      response = { comments: success, error: false, status: 'SUCCESS' };
    });

    res.json(response);
  } catch (e) {
    res.status(500).send(
      (respuesta = {
        status: 'ERROR',
        message: 'Error al realizar petición',
        error: true,
      })
    );
  }
}

/**
 * @description Handler para actualizar un Comment
 * @author Juan Sebastian Vernaza Lopez
 * @date 01/10/2021
 * @param {*} req
 * @param {*} res
 */
async function updateComment(req, res) {}

/**
 * @description Handler para eliminar un Comment.
 * @author Juan Sebastian Vernaza Lopez
 * @date 01/10/2021
 * @param {*} req
 * @param {*} res
 */
async function deleteComment(req, res) {}

module.exports = {
  getAllPostComments,
  createPostComment,
  updateComment,
  deleteComment,
};
