const Account = require('../Models/accountModel');

/**
 * GET /account/signup
 * Render signup form
 * Note: redirectIfAuthenticated middleware handles logged-in users
 */
exports.signupPage = (req, res) => {
  res.render('signup', { error: null, user: null });
};

/**
 * POST /account/signup
 * Handle signup form submission
 */
exports.signup = async (req, res) => {
  try {
    const { email, password, fullname, isAlumni } = req.body;

    // Validate inputs
    if (!email || !password || !fullname) {
      return res.render('signup', { error: 'All fields are required', user: null });
    }

    const existingUser = await Account.findOne({ email });
    if (existingUser) {
      return res.render('signup', { error: 'An account with this email already exists', user: null });
    }

    // Convert isAlumni to boolean
    const alumniStatus = isAlumni === 'on' || isAlumni === true;

    const user = await Account.create({ 
      email, 
      password, 
      fullname,
      isAlumni: alumniStatus
    });

    // Store session info
    req.session.userId = user._id;
    req.session.isAlumni = user.isAlumni;
    req.session.fullname = user.fullname;
    
    // Set permissions based on alumni status
    // Alumni: read:analytics, read:profile, write:profile (all pages)
    // Non-Alumni: read:analytics (dashboard only)
    if (user.isAlumni) {
      req.session.permissions = ['read:analytics', 'read:profile', 'write:profile'];
    } else {
      req.session.permissions = ['read:analytics'];
    }

    // Save session before redirect
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
      }
      res.redirect('/account/dashboard');
    });

  } catch (err) {
    res.render('signup', { error: err.message, user: null });
  }
};

/**
 * GET /account/login
 * Render login form
 * Note: redirectIfAuthenticated middleware handles logged-in users
 */
exports.loginPage = (req, res) => {
  res.render('login', { error: null, user: null });
};

/**
 * POST /account/login
 * Handle login form submission
 * Both alumni and non-alumni can log in
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.render('login', { error: 'Email and password are required', user: null });
    }

    // Get user WITH password
    const user = await Account.findOne({ email }).select('+password');

    if (!user) {
      return res.render('login', { error: 'Invalid email or password', user: null });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.render('login', { error: 'Invalid email or password', user: null });
    }

    // Store session info for both alumni and non-alumni
    req.session.userId = user._id;
    req.session.isAlumni = user.isAlumni;
    req.session.fullname = user.fullname;

    // Set permissions based on alumni status
    // Alumni: read:analytics, read:profile, write:profile (all pages)
    // Non-Alumni: read:analytics (dashboard only)
    if (user.isAlumni) {
      req.session.permissions = ['read:analytics', 'read:profile', 'write:profile'];
    } else {
      req.session.permissions = ['read:analytics'];
    }

    // Save session before redirect
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
      }
      res.redirect('/account/dashboard');
    });

  } catch (err) {
    res.render('login', { error: err.message, user: null });
  }
};

/**
 * GET /account/dashboard
 * Display authenticated user dashboard
 * Both alumni and non-alumni can access (read:analytics permission)
 */
exports.dashboard = async (req, res) => {
  try {
    const user = await Account.findById(req.session.userId);

    if (!user) {
      req.session.destroy();
      return res.redirect('/account/login');
    }

    res.render('dashboard', { 
      user,
      isAlumni: req.session.isAlumni || false,
      permissions: req.session.permissions || []
    });

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
