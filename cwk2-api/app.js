const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

const accountRouter = require("./routes/accountRoutes");
const analyticsRouter = require("./routes/analyticsRoutes");

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
app.set('view engine', 'ejs');
app.set('views', './views');

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

// Routes
app.use("/account", accountRouter);
app.use("/api/analytics", analyticsRouter);

// Home redirect to login
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/account/dashboard');
  } else {
    res.redirect('/account/login');
  }
});
