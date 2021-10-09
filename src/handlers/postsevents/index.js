const { updateEventPost } = require('../../functions/postevents/eventsFunctions');

/**
 * @description Agregar un like a un post en especifico
 * @author Juan Sebastian Vernaza Lopez
 * @date 06/10/2021
 * @param {*} req
 * @param {*} res
 */
async function setPostLike(req, res) {
  try {
    let input = req.body;
    let response = {};
    let codeStatus = 200;

    if(input.session_user_email === undefined){
      codeStatus = 400;
      res.status(codeStatus).json({message: 'Débes estar logueado para esta acción'});
      return;
    }

    await updateEventPost(input)
      .then((success) => {
        response = { posts: success, status: 'SUCCESS', error: false, page: input.page };
      })
      .catch((e) => {
        codeStatus = 500;
        response = { error: true, status: 'FAIL', posts: [] };
      });

    res.status(codeStatus).json(response);
  } catch (e) {
    console.log(e);
    res.status(500).send(
      (respuesta = {
        status: 'FAIL',
        message: 'Error al realizar petición',
        error: true,
      })
    );
  }
}

module.exports = {
  setPostLike,
};
