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
  
    app.get('/posts/v1/getPost', [myLogger, verifyToken], getPosts);
    app.post('/posts/v1/createPost', [myLogger, verifyToken], getPosts);
    app.patch('/posts/v1/updatePost', [myLogger, verifyToken], getPosts);
    app.delete('/posts/v1/deletePost', [myLogger, verifyToken], getPosts);

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

