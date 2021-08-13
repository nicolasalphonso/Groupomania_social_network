// import of JSONWebToken
const jwt = require('jsonwebtoken');

// import of dotenv
const dotenv = require("dotenv").config( {path: '../'});

// try catch as different possible problems
module.exports = (req, res, next) => {
  try {
    // token is the second element of header authorization
    const token = req.headers.authorization.split(' ')[1];
    // token decoding
    const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
    // retrieving userId fron decoded token
    const userId = decodedToken.userId;
    // verifiying that the user id is the same as the token one
    if (req.body.userId && req.body.userId !== userId) {
      throw 'invalid user ID';
    } else {
      // next middleware as the request is authentified
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: error });
  }
};