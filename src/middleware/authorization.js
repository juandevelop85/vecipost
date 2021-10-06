let verifyToken = async (req, res, next) => {
  let user_session = req.get('u_session');

  if (req.payload) {
    req.payload.session_user_email = user_session;
  } else if (req.params) {
    req.params.session_user_email = user_session;
  }

  next();
};

module.exports = {
  verifyToken,
};
