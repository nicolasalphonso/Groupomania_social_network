const models = require("../models"); // import of models
const jwt = require("jsonwebtoken"); // import of JSON web token
const comment = require("../models/comment");
const dotenv = require("dotenv").config({ path: "../" }); // import of environment variables

// get all comments
exports.getComments = async (req, res, next) => {
   
  try {
    const fields = req.query.fields;
    const order = req.query.order;

    // use of sequelize syntax, on table posts using a left outer join on users
    // retrieving in it username, firstname and lastname
    const comments = await models.Comment.findAll({
        where: {
            postId: req.params.id
        },
      order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
      attributes: fields != "*" && fields != null ? fields.split(",") : null,
      include: [
        {
          model: models.User,
          attributes: ["username", "id"],
        },
        {
            model: models.Post,
            attributes: ["id"],
          },
      ],
    });
    res.status(200).send(comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

  
};


/*
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
*/

/*  modify post with id postId
  use of methods findOne and save
  if req.file, there's an image to compute
  previous image should be deleted
  else only content is updated
*/
/*
exports.modifyPost = async (req, res, next) => {
  const newContent = req.body.content;

  await models.Post.findOne({ where: { id: req.params.id } })
    .then((post) => {
      if (req.file) {
        const attachmentUrl = `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`;
        post.attachment = attachmentUrl;
        const previousImageName =
          req.body.previousImageUrl.split("/images/")[1];
        fs.unlink(`images/${previousImageName}`, (err) => {
          if (err) throw err;
        });
      }

      post.content = newContent;
      post.save();
    })
    .then(
      res
        .status(200)
        .json({ postUpdate: "Post updated !", updatedContent: newContent })
    )
    .catch((error) => res.status(500).json({ error }));
};
*/

/*
// deleting a post - destroy method
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
    .then(() =>
      res.status(200).json({ newLikers: newLikers, Liked: userLiked })
    )
    .catch((error) => res.status(500).json({ error }));
};
*/