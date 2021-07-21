// importation de JSONWebToken
const jwt = require('jsonwebtoken');

// importation de dotenv
const dotenv = require("dotenv").config( {path: '../'});

// try catch car peut plusieurs problèmes
module.exports = (req, res, next) => {
  try {
    // token est 2ème élément du header authorization
    const token = req.headers.authorization.split(' ')[1];
    // décodage du token
    const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
    // on récupère le userId du token décodé
    const userId = decodedToken.userId;
    // on vérifie que l'userId correspond à celui du token
    if (req.body.userId && req.body.userId !== userId) {
      throw 'invalid user ID';
    } else {
      // on passe au middleware suivant car la requête est authentifiée
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: error });
  }
};