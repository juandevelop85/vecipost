const { getPostsPagination, createNewPosts } = require("../../functions/postFunctions");


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
      console.log(success)
      response = { posts: success, status: 'SUCCESS', error: false, page: input.page }
    })

    res.json(response);
  } catch (e) {
    console.log(e)
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
 * @description Handler crear un post.
 * @author Juan Sebastian Vernaza Lopez
 * @date 01/10/2021
 * @param {*} req
 * @param {*} res
 */
async function createPost(req, res) {
  try {
    let input = req.body;
    let response = {};

    await createNewPosts(input).then((success) => {
      console.log(success)
      response = { posts: success, error: false, status: 'SUCCESS' }
    })

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
