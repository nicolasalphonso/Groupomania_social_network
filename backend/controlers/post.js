const models = require("../models"); // import of models
const fs = require("fs"); // import of FS to modify the file system
const jwt = require("jsonwebtoken"); // import of JSON web token
const post = require("../models/post");
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
          attributes: ["username", "id"],
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

/*  modify post with id postId
  use of methods findOne and update
  if req.file, there's an image to compute
  else req is computed as a simple object
  previous image should be deleted
*/
exports.modifyPost = async (req, res, next) => {
  // we retrieve the name of the present image
  await models.Post.findOne({ where: { id: req.params.id } })
    .then((post) => {
      previousImageName = post.attachment
        ? post.attachment.split("/images/")[0]
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
    {
      content: req.body.content,
      attachment: attachmentUrl,
      likers: req.body.likers,
    },
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
// method destroy
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
exports.likesManagement = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
  const userId = decodedToken.userId;
  let userLiked = false;
  let newLikers = null;

  await models.Post.findOne({ where: { id: req.params.id } })
    .then((post) => {
      const likersString = JSON.parse(post.likers);

      let tabLikersRaw = [];
      // creating a table with id of all likers
      for (let i = 0; i < likersString.length; i++) {
        tabLikersRaw.push(likersString[i]);
      }

      // creating a table without duplicate
      var tabLikers = tabLikersRaw.reduce(function (acc, currentValue) {
        if (acc.indexOf(currentValue) === -1) {
          acc.push(currentValue);
        }
        return acc;
      }, []);

      // if the user is in the table, remove him/her
      // else, add her/him
      if (tabLikers.includes(userId)) {
        for (var i = 0; i < tabLikers.length; i++) {
          if (tabLikers[i] == userId) {
            tabLikers.splice(i, 1);
          }
        }

        userLiked = false;
      } else {
        tabLikers.push(userId);
        userLiked = true;
      }

      // updating the likers
      post.likers = tabLikers;
      newLikers = JSON.stringify(post.likers);
      post.save();
    })
    .then(() => res.status(200).json({ "newLikers": newLikers, "Liked": userLiked }))
    .catch((error) => res.status(500).json({error}));
};
