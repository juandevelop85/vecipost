const authFunctions = require('../../functions/auth/authFunctions');

async function registerHandler(req, res) {
  try {
    const { email, password } = req.body;
    const user = await authFunctions.registerUser(email, password);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;
    const { token, user } = await authFunctions.loginUser(email, password);
    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

// Optional: Token based logout can be implemented client-side by discarding the token
async function logoutHandler(req, res) {
  // For token-based auth, logout usually handled client side by deleting token
  res.status(200).json({ message: 'Logout successful' });
}

async function passwordRecoveryHandler(req, res) {
  try {
    const { email } = req.body;
    const token = await authFunctions.generatePasswordResetToken(email);
    // Here, integrate sending email with token link in production
    res.status(200).json({ message: 'Password recovery email sent', resetToken: token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function passwordResetHandler(req, res) {
  try {
    const { token, newPassword } = req.body;
    const user = await authFunctions.resetPassword(token, newPassword);
    res.status(200).json({ message: 'Password reset successful', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  registerHandler,
  loginHandler,
  logoutHandler,
  passwordRecoveryHandler,
  passwordResetHandler
};
