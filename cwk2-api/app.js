const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');

const accountRouter = require("./routes/accountRoutes");
const analyticsRouter = require("./routes/analyticsRoutes");
const profileRouter = require("./routes/profileRoutes");
const adminRouter = require("./routes/adminRoutes");

const session = require('express-session');
const { attachUserInfo } = require('./Middleware/authMiddleware');

const app = express();

// Session configuration with secure cookie settings
app.use(
  session({
    secret: process.env.MY_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,      // Prevents client-side JS from reading the cookie
      sameSite: "strict",  // CSRF protection
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    },
    name: 'alumni.sid' // Custom session cookie name
  })
);

// View engine configuration
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', './views');
app.set('layout', 'layout');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Attach user info to all requests (for templates)
app.use(attachUserInfo);

// Database connection
const dbURI = process.env.DB_LINK;
mongoose.connect(dbURI)
  .then(() => {
    const port = 3001;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  });

// Routes - Shared auth at root level
app.use("/account", accountRouter);

// CWK1 routes - Alumni profile management (requires alumni status + write:profile permission)
app.use("/cwk1/profile", profileRouter);

// CWK2 routes - Analytics and dashboard (requires read:analytics permission)
app.use("/cwk2/analytics", analyticsRouter);

// Admin routes
app.use("/admin", adminRouter);

// Home redirect to login or dashboard based on auth status
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/account/dashboard');
  } else {
    res.redirect('/account/login');
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).render('access-denied', {
    user: req.session.userId ? { fullname: req.session.fullname } : null,
    isAlumni: req.session.isAlumni || false,
    permissions: req.session.permissions || [],
    requiredPermission: null,
    message: 'Page not found. The resource you are looking for does not exist.'
  });
});
