const Account = require('../Models/accountModel');

/**
 * GET /account/signup
 * Render signup form
 */
exports.signupPage = (req, res) => {
  res.render('signup', { error: null });
};

/**
 * POST /account/signup
 * Handle signup form submission
 */
exports.signup = async (req, res) => {
  try {
    const { email, password, fullname } = req.body;

    // Validate inputs
    if (!email || !password || !fullname) {
      return res.render('signup', { error: 'All fields are required' });
    }

    const existingUser = await Account.findOne({ email });
    if (existingUser) {
      return res.render('signup', { error: 'An account with this email already exists' });
    }

    const user = await Account.create({ email, password, fullname });

    // Store session immediately (auto-login after signup)
    req.session.userId = user._id;

    res.redirect('/account/dashboard');

  } catch (err) {
    res.render('signup', { error: err.message });
  }
};

/**
 * GET /account/login
 * Render login form
 */
exports.loginPage = (req, res) => {
  res.render('login', { error: null });
};

/**
 * POST /account/login
 * Handle login form submission
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.render('login', { error: 'Email and password are required' });
    }

    // Get user WITH password
    const user = await Account.findOne({ email }).select('+password');

    if (!user) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    // Store session
    req.session.userId = user._id;

    res.redirect('/account/dashboard');

  } catch (err) {
    res.render('login', { error: err.message });
  }
};

/**
 * GET /account/dashboard
 * Display authenticated user dashboard
 */
exports.dashboard = async (req, res) => {
  try {
    const user = await Account.findById(req.session.userId);

    if (!user) {
      req.session.destroy();
      return res.redirect('/account/login');
    }

    res.render('dashboard', { user });

  } catch (err) {
    res.render('dashboard', { error: err.message, user: null });
  }
};

/**
 * GET /account/logout
 * Log out user and destroy session
 */
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.render('dashboard', { error: 'Logout failed' });
    }

    res.clearCookie('connect.sid'); // default session cookie name
    res.redirect('/account/login');
  });
};
