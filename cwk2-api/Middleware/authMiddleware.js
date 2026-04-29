exports.requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/account/login');
  }
  next();
};
