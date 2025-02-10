const jwt = require('jsonwebtoken');

// Middleware for checking user role
const authorizeRole = (roles) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({status: false, msg: 'Authorization denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {console.log("invalid token error", err); return res.status(403).json({status: false, msg: 'Session expired. Please log in again.' });}
    if (!roles.includes(user.user_type)) {
      return res.status(403).json({ msg: 'Access denied for this role' });
    }

    req.user = user;
    next();
  });
};

module.exports = { authorizeRole };
