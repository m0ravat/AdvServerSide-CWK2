const express = require('express');
const accountRouter = express.Router();

const authController = require('../Controller/authController');
const { requireAuth } = require('../Middleware/authMiddleware');

// ==========================
// AUTH ROUTES
// ==========================

// Signup routes
accountRouter.get('/signup', authController.signupPage);
accountRouter.post('/signup', authController.signup);

// Login routes
accountRouter.get('/login', authController.loginPage);
accountRouter.post('/login', authController.login);

// Dashboard (requires authentication)
accountRouter.get('/dashboard', requireAuth, authController.dashboard);

// Logout (requires authentication)
accountRouter.get('/logout', requireAuth, authController.logout);

module.exports = accountRouter;
