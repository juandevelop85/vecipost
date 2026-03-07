const { getPostsPagination, createNewPosts } = require("../../functions/posts/postFunctions");

/**
 * @description Handler to return paginated posts with query parameter support.
 * @author Juan Sebastian Vernaza Lopez
 * @date 01/10/2021
 * @param {*} req
 * @param {*} res
 */
async function getPosts(req, res) {
  try {
    // Parse page and limit from params or query with defaults
    let page = req.params.page || req.query.page || '0';
    let limit = req.params.limit || req.query.limit || '10';
    // Convert to numbers
    page = Number(page);
    limit = Number(limit);

    if (isNaN(page) || page < 0) {
      page = 0;
    }
    if (isNaN(limit) || limit <= 0) {
      limit = 10;
    }

    // Extract user email from session or authorization context (assuming middleware sets it)
    const session_user_email = req.user_email || '';

    const posts = await getPostsPagination({ limit, page, session_user_email });

    res.json({ posts, status: 'SUCCESS', error: false, page });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: 'ERROR',
      message: 'Error processing request',
      error: true,
    });
  }
}

/**
 * @description Handler to create a post.
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
      response = { posts: success, error: false, status: 'SUCCESS' };
    });

    res.json(response);
  } catch (e) {
    res.status(500).send(
      (respuesta = {
        status: 'ERROR',
        message: 'Error al realizar petici\u00f3n',
        error: true,
      })
    );
  }
}

async function updatePost(req, res) {
  // Not implemented yet
  res.status(501).json({ status: 'NOT_IMPLEMENTED', error: true });
}

async function deletePost(req, res) {
  // Not implemented yet
  res.status(501).json({ status: 'NOT_IMPLEMENTED', error: true });
}

module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
};
