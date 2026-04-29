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
    const port =  3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Profile API',
      version: '1.0.0',
      description: 'API documentation for my profile system',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',
        },
      },
    },
  },
  apis: ['./Controller/*.js', './routes/*.js'], // Updated to include controllers
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use("/account", accountRouter);
