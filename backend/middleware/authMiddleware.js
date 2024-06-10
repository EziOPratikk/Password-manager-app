const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Access denied! unauthorized user' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = decoded; // Attach decoded payload to request object
    next(); // Call the next middleware or route handler
  });
}

module.exports = authenticateToken;