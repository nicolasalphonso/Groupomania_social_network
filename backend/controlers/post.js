const models = require("../models"); // import of models
const fs = require("fs"); // import of FS to modify the file system
const jwt = require("jsonwebtoken"); // import of JSON web token
const dotenv = require("dotenv").config({ path: "../" }); // import of environment variables
const functions = require("./functions");

/**
 * get all posts
 */
exports.getAllPosts = async (req, res) => {
  try {
    const fields = req.query.fields;
    const order = req.query.order;

    // use of sequelize syntax, on table posts using a left outer join on users
    // retrieving in it : id, bio, username, firstname and lastname
    const posts = await models.Post.findAll({
      order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
      attributes: fields != "*" && fields != null ? fields.split(",") : null,
      include: [
        {
          model: models.User,
          attributes: [
            "username",
            "id",
            "attachment",
            "bio",
            "lastname",
            "firstname",
          ],
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

/**
 * create a post
 *  if req.file, there's an image to compute
 */
exports.createPost = async (req, res) => {
  // first verify that content length is correct
  if (req.body.content.length < 65000) {
    // use of token informations to get id
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);

    // if the req doesn't have a file -> attachment = NULL
    var attachment = req.file
      ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
      : "NULL";

    // create the post with sequelize syntax
    try {
      const newPost = await models.Post.create({
        userId: decodedToken.userId,
        content: req.body.content,
        attachment: attachment,
      });
      res.status(201).json({
        postId: newPost.id,
      });
    } catch (error) {
      res.status(400).json({ error })
    }
  } else {
    res.status(500).json({
      error: "Text is too long",
    });
  }
};

/**   modify post with id postId
*  use of methods findOne and save
*  if req.file, there's an image to compute
*  previous image should be deleted
*  else only content is updated
*/
exports.modifyPost = async (req, res) => {
  // first verify that content length is correct
  if (req.body.content.length < 65000) {
    const newContent = req.body.content;

    // determine who is allowed to perform the action
    let allowed = functions.isAllowed(req);

    // select the post to modify
    const postToModify = await models.Post.findOne({ where: { id: req.params.id } });

    // verify that the user is the owner
    if (allowed.userIdFromToken === postToModify.userId) {
      // if there's an image attached
      if (req.file) {

        // deleting previous image if there was one
        if (postToModify.attachment !== "NULL") {
          const previousImageName = postToModify.attachment.split("/images/")[1];
          fs.unlink(`images/${previousImageName}`, (err) => {
            if (err) throw err;
          });
        }

        // defining the new attachment
        const attachmentUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename
          }`;
        postToModify.attachment = attachmentUrl;
      }


      postToModify.content = newContent;
      postToModify.save()
        .then(
          res
            .status(200)
            .json({ postUpdate: "Post updated !", updatedContent: newContent })
        )
        .catch((error) => res.status(500).json({ error }));

    }
    else {
      // the user is not allowed to perform the action
      res.status(500).json({ error: "user not allowed to use this fonction" });
    }


  } else {
    res.status(500).json({
      error: "Text is too long",
    });
  }
};

/** Function delete post
 * First delete the comment(s)
 * Then delete the image of the post
 * Finally delete the post
 */
exports.deletePost = async (req, res) => {
  // verify that the user is the owner or the admin
  let allowed = functions.isAllowed(req);

  // select the post to delete
  const post = await models.Post.findOne({ where: { id: req.params.id } });

  // verify that the user is the owner or an admin
  if (allowed.userIdFromToken === post.userId || allowed.isAdminFromToken === 1) {
    try {
      // first delete all comments associated with the post
      const commentsToDelete = await models.Comment.findAll({
        where: { postId: req.params.id },
      });

      for (i = 0; i < commentsToDelete.length; i++) {
        let singleCommentToDelete = commentsToDelete[i];
        singleCommentToDelete.destroy();
      }

      // delete image associated to the post
      if (post.attachment !== "NULL") {
        const filename = post.attachment.split("/images/")[1];

        fs.unlink(`images/${filename}`, (err) => {
          if (err) throw err;
        });
      }

      //delete the post
      post.destroy();
      res.status(200).json({ post: "Post deleted !" });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
  else {
    res.status(500).json({ error: "user not allowed to use this fonction" });
  }
};

/**
 * Function of likes management
 * as mysql does not accept arrays I use a string to store the pattern of the array
 * I transform the string into an array when I need to read or modify it
 */
exports.likesManagement = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
  const userId = decodedToken.userId;

  let userLiked = false;
  let newLikers = null;
  let tabLikersRaw = [];

  // selecting the post
  await models.Post.findOne({ where: { id: req.params.id } })
    .then((post) => {
      const likersString = JSON.parse(post.likers);


      // creating a table with id of all likers
      for (let i = 0; i < likersString.length; i++) {
        tabLikersRaw.push(likersString[i]);
      }

      // creating a table without duplicate
      // in case a user found a way to cheat
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
