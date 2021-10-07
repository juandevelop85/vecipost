const { verifyToken } = require('../../middleware/authorization');
const { setPostLike } = require('../../handlers/postsevents');

const init = (app) => {
  var myLogger = async function (req, res, next) {
    res.setTimeout(50000, function () {
      const response = { message: 'La petición esta tardando en responder.', token: null, error: true };
      res.json(response);
    });

    next();
  };

  app.post('/postsevents/v1/likePost', [myLogger, verifyToken], setPostLike);
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
