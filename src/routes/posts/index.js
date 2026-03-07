const { verifyToken } = require('../../middleware/authorization');
const multer = require('multer');
const upload = multer();

const {
  getPosts,
  createPost,
  updatePost,
  deletePost
} = require('../../handlers/posts/postsHandlers');
const { generateMessage } = require('../../handlers/errors/errorsMessageBuilder');
const { importProjectData } = require('../../functions/posts/postFunctions');

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

  // New route for project import
  app.post('/posts/v1/import', [myLogger, verifyToken, upload.single('file')], async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: true, message: 'No file uploaded' });
      }

      let importData;
      try {
        importData = JSON.parse(req.file.buffer.toString('utf8'));
      } catch (err) {
        return res.status(400).json({ error: true, message: 'Invalid JSON file' });
      }

      const result = await importProjectData(importData);

      res.status(200).json({ error: false, message: result.message, counts: result.counts });
    } catch (error) {
      next(error);
    }
  });

  app.use(async (err, req, res, next) => {
    //saveLogError();
    let message = await generateMessage(err);
    res.status(err.status || 500).json({
      message: message,
      errors: err.errors,
      error: true,
    });
  });
};

module.exports.init = init;
