let verifyToken = async (req, res, next) => {
  let user_session = req.get('authorization');
  
  if (Object.keys(req.body).length !== 0) {
    req.body.session_user_email = user_session;
  } else if (Object.keys(req.params).length !== 0) {
    req.params.session_user_email = user_session;
  }
  next();
};

module.exports = {
  verifyToken,
};
