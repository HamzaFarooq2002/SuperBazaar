const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured on the server');
  }
  return jwt.sign({ id: userId }, secret, { expiresIn: process.env.JWT_EXPIRE || '24h' });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    if (!process.env.JWT_SECRET) return null;
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
