const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');

const accountRouter = require("./routes/accountRoutes");
const analyticsRouter = require("./routes/analyticsRoutes");
const profileRouter = require("./routes/profileRoutes");

const session = require('express-session');

const app = express();

// Session configuration
app.use(
  session({
    secret: process.env.MY_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 30
    }
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

// CWK1 routes - Alumni profile management
app.use("/cwk1/profile", profileRouter);

// CWK2 routes - Analytics and dashboard
app.use("/cwk2/analytics", analyticsRouter);

// Home redirect to login
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/account/dashboard');
  } else {
    res.redirect('/account/login');
  }
});
