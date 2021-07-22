// import of models
const models = require("../models");

// importation de FS pour la modification du système de fichiers
// ici pour la suppression
const fs = require("fs");
//const { where } = require("sequelize/types");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config({ path: "../" });

// Create a post
exports.createPost = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);

  console.log("token : " + token);
  console.log("decoded Token userd Id : " + decodedToken.userId);

  // analyse de la requête pour obtenir un objet utilisable
  //const postObject = JSON.parse(req.body.post);
  const postObject = req.body;
  console.log(req.body.attachment);

  const newPost = await models.Post.create({
    ...postObject,
    attachment: `${req.protocol}://${req.get("host")}/images/${
      req.body.post.attachment
    }`,
  })
  .catch((error) => res.status(400).json({ error }));

  return res.status(201).json({
    postId: newPost.id,
  });

  
};

// get all posts
exports.getAllPosts = async (req, res, next) => {
  try {
    const fields = req.query.fields;
    const order = req.query.order;

    const posts = await models.Post.findAll({
      order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
      attributes: fields != "*" && fields != null ? fields.split(",") : null,
      include: [
        {
          model: models.User,
          attributes: ["username", "firstname", "lastname"],
        },
      ],
    });
    if (!posts) {
      throw new Error(" Nothing to fetch");
    }
    res.status(200).send(posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// modification de la sauce correspondant à l'id dans la base de données
// méthodes findOne et updateOne
// si on a un req.file = on a une image à traiter
// sinon on peut traiter la requête comme objet directement
exports.modifyPost = (req, res, next) => {
  /*
  // l'image actuelle doit elle être effacée après remplacement ?
  const effacementAncienneImage = req.file ? true : false;

  // on récupère le nom de l'image actuelle
  // deuxième élément de sauce.imageUrl
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    nomImageActuelle = sauce.imageUrl.split("/images/")[1]; // var globale
  });

  // si l'objet est un fichier cela veut dire qu'on remplace l'image
  // il faut alors récupérer cette image et indiquer son adresse
  // d'enregistrement sur le serveur local
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : //sinon on récupère juste les éléments de la réponse
      { ...req.body };

  // On met à jour la sauce
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => {
      res.status(200).json({ post: "Sauce modifiée !" });
      // on efface l'ancienne image si elle a été remplacée
      if (effacementAncienneImage) {
        fs.unlink(`images/${nomImageActuelle}`, (err) => {
          if (err) throw err;
        });
      }
    })
    .catch((error) => res.status(400).json({ error }));
    */
};

// supression d'une sauce
// méthode deleteOne ( objet de comparaison)
exports.deletePost = (req, res, next) => {
  /*
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // j'efface l'image et je supprime la sauce
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ post: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));*/
};

// management des likes
exports.likesManagement = (req, res, next) => {
  /*
  const like = req.body.like;
  const userId = req.body.userId;

  // pour la sauce concernée
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const usersWhoLiked = sauce.usersLiked;
      const usersWhoDisliked = sauce.usersDisliked;
       updateValues = {
        likes: 0,
        dislikes: 0,
        usersLiked: usersWhoLiked,
        usersDisliked: usersWhoDisliked,
      };

      switch (like) {
        // on étudie 3 cas
        case 0: // l'utilisateur a annulé son avis
          // s'il était dans la liste des likers
          if (usersWhoLiked.indexOf(userId) !== -1) {
            updateValues.usersLiked.pull(userId);
          }
          // s'il est dans la liste des unlikers on l'enlève de la liste des unlikers et on enlève un dislike
          if (usersWhoDisliked.indexOf(userId) !== -1) {
            updateValues.usersDisliked.pull(userId);
          }
          break;

        case 1: // l'utilisateur a liké la sauce
          // s'il n'est ni dans la liste des likers ou dislikers
          // on ajoute l'utilisateur à la liste des likers et
          // on ajoute un like
          if (
            usersWhoDisliked.indexOf(userId) !== -1 ||
            usersWhoLiked.indexOf(userId) !== -1
          ) {
            console.log("l'utilisateur ne peut effectuer cette action");
          } else {
            updateValues.usersLiked.push(userId);
          }
          break;

        case -1: // l'utilisateur a disliké la sauce
          // s'il n'est ni dans la liste des likers ou dislikers
          // on ajoute l'utilisateur à la liste des dislikers
          // on ajoute un dislike
          if (
            usersWhoDisliked.indexOf(userId) !== -1 ||
            usersWhoLiked.indexOf(userId) !== -1
          ) {
            console.log("l'utilisateur ne peut effectuer cette action");
          } else {
            updateValues.usersDisliked.push(userId);
          }
          break;
      }
      // Nouveau nombre de likes et dislikes
      updateValues.likes = updateValues.usersLiked.length;
      updateValues.dislikes = updateValues.usersDisliked.length;
 
      // Update de la sauce
      Sauce.updateOne({ _id: req.params.id }, updateValues)
        .then(() =>
          res
            .status(200)
            .json({ post: "La notation de la sauce a été mise à jour" })
        )
        .catch((error) => res.status(400).json({ error }));
    })

    .catch((error) => res.status(500).json({ error }));*/
};
