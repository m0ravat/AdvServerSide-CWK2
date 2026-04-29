const express = require('express');
const accountRouter = express.Router();

const authController = require('../Controller/authController');
const {requireAuth} = require('../Middleware/authMiddleware');
const profileRouter = require("./profileRoutes");

// ==========================
// AUTH ROUTES
// ==========================

// Signup
accountRouter.post('/signup', authController.signup);

// Login
accountRouter.post('/login', authController.login);

// Logout (requires user to be logged in)
accountRouter.post('/logout', requireAuth, authController.logout);

// Get current logged-in user
accountRouter.get('/me', requireAuth, authController.getProfile);

accountRouter.use("/profile", requireAuth, profileRouter);
module.exports = accountRouter;


