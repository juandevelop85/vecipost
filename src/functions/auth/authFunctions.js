const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../../models/users');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
const JWT_EXPIRATION = '1h';
const PASSWORD_RESET_EXPIRATION_MINUTES = 60; // 1 hour expiration

async function registerUser(email, password) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    email,
    password_hash
  });

  return {
    id: user.id,
    email: user.email
  };
}

async function loginUser(email, password) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const passwordValid = await bcrypt.compare(password, user.password_hash);
  if (!passwordValid) {
    throw new Error('Invalid email or password');
  }

  const tokenPayload = {
    id: user.id,
    email: user.email
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

  return {
    token,
    user: {
      id: user.id,
      email: user.email
    }
  };
}

async function generatePasswordResetToken(email) {
  if (!email) {
    throw new Error('Email is required');
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('User with this email does not exist');
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + PASSWORD_RESET_EXPIRATION_MINUTES * 60000);

  user.password_reset_token = token;
  user.password_reset_expiry = expiry;

  await user.save();

  // In real scenario, send email with token here
  return token;
}

async function verifyResetToken(token) {
  if (!token) {
    throw new Error('Reset token is required');
  }

  const user = await User.findOne({ where: { password_reset_token: token } });
  if (!user) {
    throw new Error('Invalid reset token');
  }

  if (!user.password_reset_expiry || user.password_reset_expiry < new Date()) {
    throw new Error('Reset token expired');
  }

  return user;
}

async function resetPassword(token, newPassword) {
  if (!token || !newPassword) {
    throw new Error('Reset token and new password are required');
  }

  const user = await verifyResetToken(token);

  const saltRounds = 10;
  const new_password_hash = await bcrypt.hash(newPassword, saltRounds);

  user.password_hash = new_password_hash;
  user.password_reset_token = null;
  user.password_reset_expiry = null;

  await user.save();

  return {
    id: user.id,
    email: user.email
  };
}

module.exports = {
  registerUser,
  loginUser,
  generatePasswordResetToken,
  verifyResetToken,
  resetPassword
};
