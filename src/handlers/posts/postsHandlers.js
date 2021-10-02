const { getPostsPagination } = require("../../functions/postFunctions");


/**
 * @description Handler para retorna los post paginados.
 * @author Juan Sebastian Vernaza Lopez
 * @date 01/10/2021
 * @param {*} req
 * @param {*} res
 */
async function getPosts(req, res) {
  try {
    let input = req.params;
    let response = {};

    await getPostsPagination(input).then((success) => {
      response = { posts: success, error: false }
    })

    res.json(response);
  } catch (e) {
    res.status(500).send(
      (respuesta = {
        message: 'Error al realizar petición',
        error: true,
      })
    );
  }
}

/**
 * @description Handler crear un documento.
 * @author Juan Sebastian Vernaza Lopez
 * @date 01/10/2021
 * @param {*} req
 * @param {*} res
 */
async function createPost(req, res) {}

/**
 * @description Handler para actualizar un post
 * @author Juan Sebastian Vernaza Lopez
 * @date 01/10/2021
 * @param {*} req
 * @param {*} res
 */
async function updatePost(req, res) {}

/**
 * @description Handler para eliminar un post.
 * @author Juan Sebastian Vernaza Lopez
 * @date 01/10/2021
 * @param {*} req
 * @param {*} res
 */
async function deletePost(req, res) {}

module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
};
