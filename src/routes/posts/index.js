const { verifyToken } = require('../../middleware/authorization');

const { getPosts, createPost, updatePost, deletePost } = require('../../handlers/posts/postsHandlers');
const { generateMessage } = require('../../handlers/errors/errorsMessageBuilder');


const init = (app) => {
    var myLogger = async function (req, res, next) {
      res.setTimeout(50000, function () {
        const response = { message: 'La petición esta tardando en responder.', error: true };
        res.json(response);
      });
  
      next();
    };
  
    app.get('/posts/v1/getPosts/:limit/:page', [myLogger, verifyToken], getPosts);
    app.post('/posts/v1/createPost', [myLogger, verifyToken], createPost);
    app.patch('/posts/v1/updatePost', [myLogger, verifyToken], updatePost);
    app.delete('/posts/v1/deletePost', [myLogger, verifyToken], deletePost);

    app.use(async (err, req, res, next) => {
      //saveLogError();
      let message = await generateMessage(err);
      res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
        error: true,
      });
    });
  };
  
  module.exports.init = init;

