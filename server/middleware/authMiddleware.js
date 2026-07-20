// middleware/authMiddleware.js
// This function runs BEFORE any "protected" route.
// It checks: did the user send a valid login token (JWT)?
// If yes -> let them through. If no -> block with 401 (Unauthorized).

const jwt = require('jsonwebtoken');

function protect(req, res, next) {
  const authHeader = req.headers.authorization; // frontend sends: "Bearer <token>"

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  const token = authHeader.split(' ')[1]; // grab just the token part

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info (id) to the request so routes can use it
    next(); // token is valid -> continue to the actual route
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = protect;
