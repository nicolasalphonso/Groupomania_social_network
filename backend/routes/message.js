const express = require('express');
// routeur nécessaire (optimisation des fichiers du backend)
const router = express.Router();

// importation du middleware d'authentification
const auth = require('../middleware/auth');
// importation du middleware de gestion des fichiers
const multer = require('../middleware/multer-config');

// les logiques métier sont dans le fichier controler message
const messageCtrl = require('../controlers/message');

// les requêtes sont authentifiées (auth)
// route de récupération de l'ensemble des messages
router.get('/', auth, messageCtrl.getAllMessages);
//route de création d'une sauce
router.post('/', auth, multer, messageCtrl.createMessage);
//route de récupération d'une sauce
// les ":" avant id signifie que cette partie de la route est dynamique
router.get('/:id', auth, messageCtrl.getOneMessage);
// route de modification d'une sauce
router.put('/:id', auth, multer, messageCtrl.modifyMessage);
// route de suppression d'une sauce
router.delete('/:id', auth, messageCtrl.deleteMessage);
// route de gestion des likes
router.post('/:id/like', auth, messageCtrl.likesManagement);

// on exporte le routeur
module.exports = router;