const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  let token = req.header('Authorization');
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  token = token.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
module.exports = auth;