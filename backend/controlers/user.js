const { Sequelize } = require("sequelize");

// Option 1: Passing a connection URI
const sequelize = new Sequelize("sqlite::memory:"); // Example for sqlite

// importation de dotenv
const dotenv = require("dotenv").config({ path: "../" });

// mportation de bcrypt
const bcrypt = require("bcrypt");

const { Hash } = require("crypto");

// importation de cryptojs -
const cryptojs = require("crypto-js");

// importation du modèle User
const models = require("../models");

// importation de JSONWebToken pour la gestion des tokens
const jwt = require("jsonwebtoken");

// importation de password-validator
const passwordValidator = require("password-validator");
const { getMaxListeners } = require("process");

// importation de email-validator
const validator = require("email-validator");

const fs = require("fs"); // import of FS to modify the file system

// Create a schema
var schema = new passwordValidator();

// Propriétés du mot de passe
schema
  .is()
  .min(8) // Taille minimale 8
  .is()
  .max(12) // Taille maximale 12
  .has()
  .uppercase() // Contient au moins une majuscule
  .has()
  .lowercase() // Contient au moins une minuscule
  .has()
  .digits(2) // Doit contenir au moins 2 chiffres
  .has()
  .not()
  .spaces() // Ne doit pas contenir d'espace
  .has()
  .symbols(); // Doit contenir au moins un symbole

// enregistrement de nouveaux utilisateurs

exports.signup = async (req, res, next) => {
  /* Todo validation des inputs utilisateurs (taille des champs, valeurs, 
  ...
  */
  const validationMDP = schema.validate(req.body.password);

  const validationEmail = validator.validate(req.body.email);

  if (validationMDP && validationEmail) {
    bcrypt
      .hash(req.body.password, 10) // on fait 10 tours de cryptage
      // enregistre l'utilisateur dans bdd avec mot de passe crypté
      .then((hash) => {
        const user = models.User.create({
          // cryptage de l'email dans la bdd. Pas de salage pour pouvoir la récupérer
          // si besoin de faire un emailing par exemple.
          email: cryptojs
            .HmacSHA256(req.body.email, process.env.EMAIL_KEY_SECRET)
            .toString(),
          password: hash,
          username: req.body.username,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          bio: req.body.bio,
          isAdmin: req.body.isAdmin,
        })
          .then(function (user) {
            return res.status(201).json({
              userId: user.id,
            });
          })
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    if (!validationEmail) {
      res.status(400).json({
        error: "L'adresse mail n'est pas valide",
      });
    } else {
      res.status(400).json({
        error:
          "Password must contain at least one lowercase, one uppercase, one special character, 2 digits. It must be between 8 and 12 characters long",
      });
    }
  }
};

// connexion des utilisateurs existants
exports.login = (req, res, next) => {
  // on crypte l'adresse email fournie pour la comparer ensuite à ce qui se trouve dans la bdd
  const adresseRequeteCryptee = cryptojs
    .HmacSHA256(req.body.email, process.env.EMAIL_KEY_SECRET)
    .toString();

  // on cherche dans bdd le user correspondant à l'adresse email
  models.User.findOne({ where: { email: adresseRequeteCryptee } })
    // on vérifie d'abord que l'utilisateur existe
    .then((user) => {
      if (!user) {
        // accès non autorisé : erreur 401
        return res.status(401).json({ error: "User not found !" });
      }
      // on compare les hashs du mot de passe envoyé et celui de la bdd
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // si le mot de passe est faux
          if (!valid) {
            return res.status(401).json({ error: "Incorrect password !" });
          }
          // Send a simple token
          // token expires in 1h

          token = jwt.sign(
            { userId: user.id, isAdmin: user.isAdmin },
            process.env.RANDOM_TOKEN_SECRET,
            { expiresIn: "4h" }
          );

          res.status(200).cookie("token", token).json({
            userId: user.id,
            token: token,
          });
        })

        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getUserProfile = async (req, res, next) => {
  await models.User.findOne({ where: { id: req.params.id } }).then((data) => {
    res.status(200).json({ data });
  });
};

exports.updateUserPhotoProfile = async (req, res) => {
  await models.User.findOne({ where: { id: req.params.id } })
    .then((user) => {
      const attachmentUrl = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
      user.attachment = attachmentUrl;
      user.save();

      if (
        req.body.previousImageUrl.split("/images/")[0] ===
        `${req.protocol}://${req.get("host")}`
      ) {
        const previousImageName =
          req.body.previousImageUrl.split("/images/")[1];
        console.log(previousImageName);

        fs.unlink(`images/${previousImageName}`, (err) => {
          if (err) throw err;
        });
      }
    })
    .then((res) => res.status(200).json({ photoProfile: "updated" }))
    .catch((err) => res.status(500).json({ err }));
};

exports.updateUserInfoProfile = async (req, res) => {
  await models.User.findOne({ where: { id: req.params.id } })
    .then((user) => {
      console.log(req.body);
      const value = req.body.value;
      switch (req.body.type) {
        case "username":
          user.username = value;
          break;

        case "firstname":
          user.firstname = value;
          break;

        case "lastname":
          user.lastname = value;
          break;

        case "email":
          const isValidEmail = validator.validate(value);
          if (isValidEmail) {
            user.email = cryptojs
              .HmacSHA256(value, process.env.EMAIL_KEY_SECRET)
              .toString();
          } else {
            res
              .status(400)
              .json({ emailerror: "the email address is not valid" });
          }
          break;

        case "password":
          const isValidPassword = schema.validate(value);
          if (isValidPassword) {
            user.password = bcrypt.hash(value, 10);
          } else {
            res
              .status(400)
              .json({
                passworderror:
                  "the password is not valid : Password must contain at least one lowercase, one uppercase, one special character, 2 digits. It must be between 8 and 12 characters long",
              });
          }
          break;

        default:
          res
            .status(500)
            .json({ "error": "the data can not be updated" });
          break;
      }
      user.save();
    })
    .then((res) => res.status(200).json({ infoProfile: "updated" }))
    .catch((err) => res.status(500).json({ err }));
};
