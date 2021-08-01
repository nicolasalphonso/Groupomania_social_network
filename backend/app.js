// Application utilisant le framework Express
// utilise sequilize pour la gestion de la base de données MySQL
const express = require("express"); // importation d'Express
const bodyParser = require('body-parser');
const dotenv = require("dotenv").config(); // importation de dotenv
const helmet = require('helmet'); // importation de Helmet - sécurisation des entêtes HTTP
const xss = require('xss-clean'); // importation de XSS Clean contre les attaques XSS
const { Sequelize, Model, DataTypes } = require('sequelize'); // importation de sequelize
const sequelize = new Sequelize('sqlite::memory:');

// Connexion à la base de données
try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

const toobusy = require('toobusy-js'); // importation de toobusy-js : prévention des attaques DoS (Denial of Service)
// importation de morgan et fs pour la génération et l'écriture des logs
const morgan = require('morgan');
const fs = require('fs');
// importation de express-session - stocke les données de session sur le serveur
// en production, il faut des configurations supplémentaires
const session = require('express-session');
// importation de path pour accéder au path de notre serveur
const path = require('path');

// Routeurs pour les "posts" et les "utilisateurs"
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');
const commentRoutes = require('./routes/comment');

const app = express(); // notre application

// too busy - prévention de DoS
app.use(function(req, res, next) {
  if (toobusy()) {
      res.status(503, "Le serveur est surchargé");
  } else {
  next();
  }
});

  // headers pour éviter les erreurs CORS - appliqué à toutes les routes
  // nous souhaitons que nos deux serveurs puissent communiquer
  // Cross Origin Resource sharing
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next(); // passe l'exécution au middleware suivant
  });
  
  //Body Parser configuration
  app.use(bodyParser.urlencoded({ extended: true}))
  
  // transforme le corps de la requête en objet JSON
  app.use(express.json());

  // Log de toutes les requêtes
  const accessLogs = fs.createWriteStream(path.join(__dirname, 'requetes.log'), { flags: 'a'});
  app.use(morgan('combined', { stream: accessLogs}));

  // Stockage de manière persistante du JSON Web token durant 15 minutes
  app.use(session({ secret: process.env.COOKIE_KEY_SECRET, resave: false, saveUninitialized: true, cookie: { maxAge: 900000}}));

  // Sécurisation des entêtes
  app.use(helmet());

  // Prévention des attaques XSS
  app.use(xss());
  
  // répond aux requêtes à /images en rendant notre dossier images statique 
  app.use('/images', express.static(path.join(__dirname, 'images')));

  // routes of basic routeurs
  app.use('/api/posts', postRoutes); 
  app.use('/api/auth', userRoutes);
  app.use('/api/comments', commentRoutes);
  

// exportation de l'application pour pouvoir y accéder depuis
// d'autres fichiers notamment le serveur node
module.exports = app;