const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

const accountRouter = require("./routes/accountRoutes");

const session = require('express-session');



const app = express();
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
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbURI = process.env.DB_LINK;
mongoose.connect(dbURI)
  .then(() => {
    const port =  3001;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })


app.use("/account", accountRouter);