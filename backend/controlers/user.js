// import dotenv
const dotenv = require("dotenv").config({ path: "../" });

// import bcrypt
const bcrypt = require("bcrypt");

// const { Hash } = require("crypto");

// import cryptojs -
const cryptojs = require("crypto-js");

// import models
const models = require("../models");

// import JSONWebToken
const jwt = require("jsonwebtoken");

// import password-validator
const passwordValidator = require("password-validator");
// Create a schema
var schema = new passwordValidator();

// const { getMaxListeners } = require("process");

// import email-validator
const validator = require("email-validator");

// import of FS to modify the file system
const fs = require("fs");

//import custom functions
const functions = require("./functions");

// password properties used by password-validator
schema
  .is()
  .min(8) // min length 8
  .is()
  .max(16) // max length 16
  .has()
  .uppercase() // contains at least 1 capital letter
  .has()
  .lowercase() // contains at least 1 lowercase letter
  .has()
  .digits(1) // contains at least 1 digit
  .has()
  .not()
  .spaces(); // no space allowed

/** Registering of new users
 */
exports.signup = async (req, res) => {
  //validate password using our schema
  const validationMDP = schema.validate(req.body.password);

  // validate email using email-validator
  const validationEmail = validator.validate(req.body.email);

  // verify that the inputs are correct
  if (
    req.body.username.length < 21 &&
    req.body.lastname.length < 31 &&
    req.body.lastname.length < 31
  ) {
    // verify that password and email are valid
    if (validationMDP && validationEmail) {
      bcrypt
        .hash(req.body.password, 10) // 10 rounds of crypting
        // then we create the user and save it
        .then((hash) => {
          models.User.create({
            // crypt email
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
            .catch((error) => {
              let errorMessage = "";

              // personalize error message
              switch (error.errors[0].message) {
                case "users.email must be unique":
                  errorMessage =
                    "Email is yet used. If you already have an account please login.\n Else contact the administrator";
                  break;

                case "users.username must be unique":
                  errorMessage =
                    "Username is yet used. If you already have an account please login.\n  Else contact the administrator";
                  break;

                default:
                  errorMessage = "Undefined error";
                  break;
              }

              res.status(400).json({ error: errorMessage });
            });
        })
        .catch((error) => res.status(500).json({ error }));
    } else {
      // email is not valid
      if (!validationEmail) {
        res.status(400).json({
          error: "Unvalid email address",
        });
      } else {
        // password is not valid
        res.status(400).json({
          error:
            "Password must contain at least one lowercase, one uppercase, 1 digits. It must be between 8 and 16 characters long",
        });
      }
    }
  } else {
    // an input is too long
    res.status(500).json({
      error:
        "One of your input is too long, please check the form you submitted",
    });
  }
};

/** users login
 */
exports.login = (req, res) => {
  // crypt email address to compare it to the ones in database
  const adresseRequeteCryptee = cryptojs
    .HmacSHA256(req.body.email, process.env.EMAIL_KEY_SECRET)
    .toString();

  // retrieving the user with the matching email address
  models.User.findOne({ where: { email: adresseRequeteCryptee } })
    .then((user) => {
      // first check that user exist
      if (!user) {
        // unauthorized access : error 401
        return res.status(401).json({ error: "User not found !" });
      }
      // compare hashes of password sent and password in database
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // if password is wrong
          if (!valid) {
            return res.status(401).json({ error: "Incorrect password !" });
          }
          // Send a simple token
          // token expires in 4h

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

/** get profile of an user
 *
 */
exports.getUserProfile = async (req, res) => {
  // retrieve the user from the database
  const data = await models.User.findOne({ where: { id: req.params.id } });

  if (data === null) {
    res.status(500).json({ error: "user not found" });
  } else {
    res.status(200).json({ data });
  }
};

/** update user profile photo
 * if user is found by his id (primary key) we delete the previous image
 * and update the profile with the new one
 * we first check that the user is allowed to perform this action
 */
exports.updateUserPhotoProfile = async (req, res) => {
  // find user by the primary key (id)
  const user = await models.User.findByPk(req.params.id);

  // determine who is allowed to perform the action
  let allowed = functions.isAllowed(req);

  // verify that the user is the owner
  if (allowed.userIdFromToken == req.params.id) {

    if (user === null) {
      res.status(500).json({ error: "user not found" });
    } else {
      try {
        // we set the URL of the new image
        const attachmentUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename
          }`;

        // we check that the image doesn't belong to the "seeders"  directory
        if (
          req.body.previousImageUrl.split("/images/")[0] ===
          `${req.protocol}://${req.get("host")}`
        ) {
          // we delete the previous image
          const previousImageName =
            req.body.previousImageUrl.split("/images/")[1];

          fs.unlink(`images/${previousImageName}`, (err) => {
            if (err) throw err;
          });
        }

        // update of the user with the new attachment
        user.attachment = attachmentUrl;
        user.save();
        res.status(200).json({ photoProfile: "updated" });
      } catch (error) {
        res.status(500).json({ error });
      }
    }
  } else {
    // the user is not allowed to perform the action
    res.status(500).json({ error: "user not allowed to use this fonction" });
  }

};

/** update user profile infos
 * if user is found by primary key (id)
 * we update the value sent according to its type
 */
exports.updateUserInfoProfile = async (req, res) => {
  // find user by the primary key (id)
  const user = await models.User.findByPk(req.params.id);

  // determine who is allowed to perform the action
  let allowed = functions.isAllowed(req);

  // verify that the user is the owner
  if (allowed.userIdFromToken == req.params.id) {
    if (user === null) {
      res.status(500).json({ error: "user not found" });
    } else {
      try {
        // check that the input is valid according to its type
        const value = req.body.value;
        let isValid = false;

        switch (req.body.type) {
          case "username":
            user.username = value;
            isValid = value.length < 21 ? true : false;
            break;

          case "firstname":
            user.firstname = value;
            isValid = value.length < 31 ? true : false;
            break;

          case "lastname":
            user.lastname = value;
            isValid = value.length < 31 ? true : false;
            break;

          default:
            res.status(500).json({ error: "the data can not be updated" });
            return;
        }
        // if value is valid, save the user updated
        if (isValid) {
          try {
            user.save();
            res.status(200).json({ infoProfile: `updated ${type}` });

          } catch (error) {
            // personalize error message
            let errorMessage = "";

            try {
              switch (error.errors[0].message) {

                case "users.username must be unique":
                  errorMessage =
                    "Username is yet used";
                  break;

                default:
                  errorMessage = "Undefined error";
                  break;
              }
            }
            catch (error) {
              console.log(error);
              return;
            }

            res.status(400).json({ error: errorMessage });
          }
          //
        } else {
          res.status(500).json({ error: "Input length is too long" });
        }
      } catch (error) {
        res.status(500).json({ error });
      }
    }
  }
  else {
    // the user is not allowed to perform the action
    res.status(500).json({ error: "user not allowed to use this fonction" });
  }

};

/** delete user account
 *  first verify that the user connected can perform the action
 * then delete user's comments
 * then delete user's posts and their comments
 * finally delete user account
 */
exports.deleteUserProfile = async (req, res) => {
  // determine who is allowed to perform the action
  let allowed = functions.isAllowed(req);
// verify that the user is the owner or the admin
  if ((allowed.userIdFromToken == req.params.id) || (allowed.isAdminFromToken === 1)) {

    // defining user id
    const userIdToDelete = req.params.id;

    // defining user to delete
    const userToDelete = await models.User.findByPk(userIdToDelete);

    if (userToDelete) {
      try {
        // delete all comments from user
        const userCommentsToDelete = await models.Comment.findAll({
          where: { userId: userIdToDelete },
        });
        for (i = 0; i < userCommentsToDelete.length; i++) {
          let userCommentToDelete = userCommentsToDelete[i];
          userCommentToDelete.destroy();
        }
        // delete all posts from user
        // first retrieve list of posts of user
        const postsToDelete = await models.Post.findAll({
          where: { userId: userIdToDelete },
        });

        // then delete all comments attached to the posts and the posts
        for (i = 0; i < postsToDelete.length; i++) {
          let postToDelete = postsToDelete[i];
          let othersCommentsToDelete = await models.Comment.findAll({
            where: { postId: postsToDelete[i] },
          });
          for (i = 0; i < othersCommentsToDelete; i++) {
            let othersCommentToDelete = othersCommentsToDelete[i];
            othersCommentToDelete.destroy();
          }
          postToDelete.destroy();
        }

        //then delete profile photo
        if (
          userToDelete.attachment.split("/images/")[0] ===
          `${req.protocol}://${req.get("host")}`
        ) {
          const profilePhoto = userToDelete.attachment.split("/images/")[1];

          fs.unlink(`images/${profilePhoto}`, (err) => {
            if (err) throw err;
          });
        }

        //finally delete account
        userToDelete.destroy();

        res.status(200).json({ userdeleted: userIdToDelete });
      } catch (error) {
        res.status(500).json({ erreurbackend: error });
      }
    }
  } else {
    res.status(500).json({ error: "user not allowed to use this fonction" });
  }
};
