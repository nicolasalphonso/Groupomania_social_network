const express = require('express');
// routeur nécessaire (optimisation des fichiers du backend)
const router = express.Router();
// controlleur pour associer les fonctions aux différentes routes
const userCtrl = require('../controlers/user');

// importation de express-bouncer - force brute
const bouncer = require("express-bouncer")(30000, 90000, 3);

/*
//routes vers les controlleurs
router.post('/signup', bouncer.block, userCtrl.signup);
router.post('/login', bouncer.block, userCtrl.login);
*/

//routes vers les controlleurs
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
//router.post('/logout', userCtrl.logout);
//router.get("/profile/:id", auth, userCtrl.getUserProfile);
//router.put("/profile/:id", auth, userCtrl.updateUserProfile);
//router.delete("/profile/:id", auth, userCtrl.deleteUserProfile);

// Clear all logged addresses
// (Usually never really used)
//bouncer.addresses = { };

// exportation des routeurs
module.exports = router;