exports.requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};
// Ensures session is valid before attemtpting to waste futher backend resources 
// by accessing a controller function