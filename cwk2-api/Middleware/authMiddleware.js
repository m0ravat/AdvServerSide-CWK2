/**
 * Authentication and Authorization Middleware
 * Handles session-based auth with role-based permissions
 * 
 * Permissions:
 * - Alumni: read:analytics, read:profile, write:profile (access all pages)
 * - Non-Alumni: read:analytics (access dashboard only)
 * - Non-Users: none (access login/signup only)
 */

/**
 * Require user to be authenticated
 * Redirects to login if not logged in
 */
exports.requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/account/login');
  }
  next();
};

/**
 * Redirect logged-in users away from login/signup pages
 * Used on public auth pages to redirect authenticated users to dashboard
 */
exports.redirectIfAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/account/dashboard');
  }
  next();
};

/**
 * Check if user has a specific permission
 * @param {string} permission - The permission to check (e.g., 'read:profile', 'write:profile')
 */
exports.requirePermission = (permission) => {
  return (req, res, next) => {
    // Check if user is logged in
    if (!req.session.userId) {
      return res.redirect('/account/login');
    }

    // Get user permissions from session
    const userPermissions = req.session.permissions || [];

    // Check if user has required permission
    if (!userPermissions.includes(permission)) {
      return res.status(403).render('access-denied', {
        user: { fullname: req.session.fullname || 'User' },
        isAlumni: req.session.isAlumni || false,
        permissions: userPermissions,
        requiredPermission: permission,
        message: 'You do not have permission to access this resource.'
      });
    }

    next();
  };
};

/**
 * Require user to be an alumni
 * Combines auth check with alumni status verification
 */
exports.requireAlumniAuth = (req, res, next) => {
  // Check if user is logged in
  if (!req.session.userId) {
    return res.redirect('/account/login');
  }

  // Check if user is alumni
  if (!req.session.isAlumni) {
    return res.status(403).render('access-denied', {
      user: { fullname: req.session.fullname || 'User' },
      isAlumni: false,
      permissions: req.session.permissions || [],
      requiredPermission: 'alumni-only',
      message: 'This page is only accessible to alumni members.'
    });
  }

  next();
};

/**
 * Attach user info to all requests (for templates)
 * Should be used globally in app.js
 */
exports.attachUserInfo = (req, res, next) => {
  res.locals.isLoggedIn = !!req.session.userId;
  res.locals.isAlumni = req.session.isAlumni || false;
  res.locals.permissions = req.session.permissions || [];
  res.locals.userFullname = req.session.fullname || null;
  next();
};
