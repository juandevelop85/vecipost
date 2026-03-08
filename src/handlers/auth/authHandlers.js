const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../../models/users');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1h';
const RESET_TOKEN_EXPIRY_MINUTES = 30;
const SALT_ROUNDS = 10;

// Helper to generate JWT token
function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// POST /auth/v1/register
async function registerHandler(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({ email, password_hash });
    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

// POST /auth/v1/login
async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    return res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

// POST /auth/v1/forgot-password
async function forgotPasswordHandler(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // To avoid user enumeration, respond success even if user not found
      return res.json({ message: 'If this email is registered, a reset token has been sent.' });
    }

    // Generate reset token and expiry
    const reset_token = crypto.randomBytes(32).toString('hex');
    const reset_token_expiry = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60000);

    user.reset_token = reset_token;
    user.reset_token_expiry = reset_token_expiry;
    await user.save();

    // In a real app, send the reset token via email here
    // For now, just return success message
    return res.json({ message: 'If this email is registered, a reset token has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

// POST /auth/v1/reset-password
async function resetPasswordHandler(req, res) {
  try {
    const { token, new_password } = req.body;
    if (!token || !new_password) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }

    const user = await User.findOne({ where: { reset_token: token } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token.' });
    }

    if (!user.reset_token_expiry || user.reset_token_expiry < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired reset token.' });
    }

    const password_hash = await bcrypt.hash(new_password, SALT_ROUNDS);
    user.password_hash = password_hash;
    user.reset_token = null;
    user.reset_token_expiry = null;
    await user.save();

    return res.json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = {
  registerHandler,
  loginHandler,
  forgotPasswordHandler,
  resetPasswordHandler
};
