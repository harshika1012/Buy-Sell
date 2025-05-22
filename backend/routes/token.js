const jwt = require('jsonwebtoken');

function generateToken(userId) {
  const payload = {
    UserId: userId,
  };
  const secret = process.env.JWT_SECRET || 'your_jwt_secret';
  const options = { expiresIn: '7d' };

  return jwt.sign(payload, secret, options);
}

// module.exports = generateToken(newUser._id.toString());