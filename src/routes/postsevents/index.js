const { verifyToken } = require('../../middleware/authorization');

const { getPosts } = require('../../handlers/posts/postsHandlers');


const init = (app) => {
    var myLogger = async function (req, res, next) {
      res.setTimeout(50000, function () {
        const response = { message: 'La petición esta tardando en responder.', token: null, error: true };
        res.json(response);
      });
  
      next();
    };
  
    // app.patch('/posts/v1/likePost', [myLogger], getPosts);
    // app.patch('/posts/v1/dislikePost', [myLogger, verifyToken], getPosts);

    app.use((err, req, res, next) => {
      //saveLogError();
      res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
        error: true,
      });
    });
  };
  
  module.exports.init = init;

