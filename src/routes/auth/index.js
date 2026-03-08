const express = require('express');
const router = express.Router();

const {
  registerHandler,
  loginHandler,
  forgotPasswordHandler,
  resetPasswordHandler
} = require('../../handlers/auth/authHandlers');

// POST /auth/v1/register - Register a new user
router.post('/register', registerHandler);

// POST /auth/v1/login - Authenticate user and return JWT token
router.post('/login', loginHandler);

// POST /auth/v1/forgot-password - Initiate password recovery
router.post('/forgot-password', forgotPasswordHandler);

// POST /auth/v1/reset-password - Reset password using valid token
router.post('/reset-password', resetPasswordHandler);

module.exports = router;
