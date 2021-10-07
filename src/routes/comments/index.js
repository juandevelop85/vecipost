const { verifyToken } = require('../../middleware/authorization');

const { getAllPostComments, createPostComment } = require('../../handlers/comments/commentsHandlers');
const { generateMessage } = require('../../handlers/errors/errorsMessageBuilder');


const init = (app) => {
    var myLogger = async function (req, res, next) {
      res.setTimeout(50000, function () {
        const response = { message: 'La petición esta tardando en responder.', token: null, error: true };
        res.json(response);
      });
  
      next();
    };
  
    app.get('/comments/v1/getPostComments/:post_id', [myLogger, verifyToken], getAllPostComments);
    app.post('/comments/v1/createComment', [myLogger], createPostComment);
    
    app.use(async(err, req, res, next) => {
      let message = await generateMessage(err);
      res.status(err.status || 500).json({
        message: message,
        errors: err.errors,
        error: true,
      });
    });
  };
  
  module.exports.init = init;

