const models = require("../models"); // import of models
const fs = require("fs"); // import of FS to modify the file system
const jwt = require("jsonwebtoken"); // import of JSON web token
//const { where } = require("sequelize/types");
const dotenv = require("dotenv").config({ path: "../" }); // import of environment variables

// get all posts
exports.getAllPosts = async (req, res, next) => {
  try {
    const fields = req.query.fields;
    const order = req.query.order;

    // use of sequelize syntax, on table posts using a left outer join on users
    // retrieving in it username, firstname and lastname
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

// Create a post
exports.createPost = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);

  //if the req doesn't have a file -> attachment = NULL
  var attachment = req.file
    ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    : "NULL";

  // create the post with sequelize syntax
  const newPost = await models.Post.create({
    userId: decodedToken.userId,
    content: req.body.content,
    attachment: attachment,
  })
    .then(() =>
      res.status(201).json({
        postId: newPost.id,
      })
    )
    .catch((error) => res.status(400).json({ error }));
};

// modify post with id postId
// use of methods findOne and update
// if req.file, there's an image to compute
// else req is computed as a simple object
exports.modifyPost = async (req, res, next) => {
  // previous image should be deleted if req.file
  // if it exists

  // const temp = await models.Post.findOne({ where: { id: req.params.id } });
  // previousImageName = temp.attachment.split("/images/")[1];

  // we retrieve the name of the present image
  await models.Post.findOne({ where: { id: req.params.id } })
    .then((post) => {
      previousImageName = post.attachment
        ? post.attachment.split("/images/")[1]
        : null; // global variable
    })
    .then(() => console.log(previousImageName));

  // if req is a file then we need to update the image
  // we store its address on the server storage
  const attachmentUrl = req.file
    ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    : "NULL";

  // We update the post
  await models.Post.update(
    { content: req.body.content, attachment: attachmentUrl },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then(() => {
      res.status(200).json({ post: "Post updated !" });
      // we delete the provious image if it was updated
      if (req.file) {
        fs.unlink(`images/${previousImageName}`, (err) => {
          if (err) throw err;
        });
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

// deleting a post
// method deleteOne ( objet de comparaison)
exports.deletePost = async (req, res, next) => {
  await models.Post.findOne({ where: { id: req.params.id } })
    .then((post) => {
      const filename = post.attachment.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        models.Post.destroy({
          where: {
            id: req.params.id,
          },
        })
          .then(() => res.status(200).json({ post: "Post deleted !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
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
