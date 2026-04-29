const Account = require('../Models/accountModel');

exports.requireAlumni = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Please log in first' });
    }

    const account = await Account.findById(req.session.userId);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (!account.isAlumni) {
      return res.status(403).json({ message: 'Only alumni can access this resource' });
    }

    next();
  } catch (error) {
    console.error('Alumni Middleware Error:', error);
    res.status(500).json({ message: 'Error checking alumni status', error: error.message });
  }
};
