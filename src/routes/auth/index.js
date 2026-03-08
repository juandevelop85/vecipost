const express = require('express');
const router = express.Router();
const authHandlers = require('../../handlers/auth/authHandlers');

router.post('/register', authHandlers.registerHandler);
router.post('/login', authHandlers.loginHandler);
router.post('/logout', authHandlers.logoutHandler);
router.post('/password-recovery', authHandlers.passwordRecoveryHandler);
router.post('/password-reset', authHandlers.passwordResetHandler);

function init(app) {
  app.use('/auth', router);
}

module.exports = {
  router,
  init
};
