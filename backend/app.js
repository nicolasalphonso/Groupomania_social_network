// Application using Express framework
// uses sequilize fot MySQL database management
const express = require("express"); // import of Express
const bodyParser = require('body-parser');
const dotenv = require("dotenv").config(); // import of dotenv
const helmet = require('helmet'); // import Helmet - securising HTTP headers
const xss = require('xss-clean'); // import XSS Clean against XSS attacks
const { Sequelize, Model, DataTypes } = require('sequelize'); // import sequelize
const sequelize = new Sequelize('sqlite::memory:');

// Connexion to database
try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

const toobusy = require('toobusy-js'); // import toobusy-js : prevents DoS Attacks (Denial of Service)
// import morgan and fs for logs
const morgan = require('morgan');
const fs = require('fs');
// import express-session - save session data on server
// in production, we'll need more settings
const session = require('express-session');
// import path to access our server path
const path = require('path');

// Routers to "posts" and "users"
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');
const commentRoutes = require('./routes/comment');

const app = express(); // our app

// too busy - prevents DoS attacks
app.use(function(req, res, next) {
  if (toobusy()) {
      res.status(503, "Le serveur est surchargé");
  } else {
  next();
  }
});

  // headers to avoid CORS errors - for all routes
  // our 2 servers must communicate
  // Cross Origin Resource sharing
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next(); 
  });
  
  //Body Parser configuration
  app.use(bodyParser.urlencoded({ extended: true}))
  
  // transforms request body in JSON object
  app.use(express.json());

  // Log of all requests
  const accessLogs = fs.createWriteStream(path.join(__dirname, 'requetes.log'), { flags: 'a'});
  app.use(morgan('combined', { stream: accessLogs}));

  // persistent save of JSON token during 15 minutes
  app.use(session({ secret: process.env.COOKIE_KEY_SECRET, resave: false, saveUninitialized: true, cookie: { maxAge: 900000}}));

  // securing headers
  app.use(helmet());

  // Prevents XSS attacks
  app.use(xss());
  
  // answers requests to images folder making folder static 
  app.use('/images', express.static(path.join(__dirname, 'images')));

  // routes of basic routers
  app.use('/api/posts', postRoutes); 
  app.use('/api/auth', userRoutes);
  app.use('/api/comments', commentRoutes);
  

// export app so that it can be reached from
// other files, especially the node server
module.exports = app;