const express = require('express');
const accountRouter = express.Router();

const authController = require('../Controller/authController');
const { requireAuth, redirectIfAuthenticated } = require('../Middleware/authMiddleware');

// ==========================
// AUTH ROUTES
// ==========================

// Signup routes - redirect to dashboard if already logged in
accountRouter.get('/signup', redirectIfAuthenticated, authController.signupPage);
accountRouter.post('/signup', redirectIfAuthenticated, authController.signup);

// Login routes - redirect to dashboard if already logged in
accountRouter.get('/login', redirectIfAuthenticated, authController.loginPage);
accountRouter.post('/login', redirectIfAuthenticated, authController.login);

// Dashboard (requires authentication - both alumni and non-alumni can access)
accountRouter.get('/dashboard', requireAuth, authController.dashboard);

// Logout (requires authentication)
accountRouter.get('/logout', requireAuth, authController.logout);

module.exports = accountRouter;
