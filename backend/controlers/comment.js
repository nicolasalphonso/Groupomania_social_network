const models = require("../models"); // import of models
//const jwt = require("jsonwebtoken"); // import of JSON web token
//const comment = require("../models/comment");
const dotenv = require("dotenv").config({ path: "../" }); // import of environment variables
const functions = require("./functions");



/** get all comments of a post */
exports.getComments = async (req, res) => {
  try {
    const fields = req.query.fields;
    const order = req.query.order;

    // use of sequelize syntax, on table posts using a left outer join on users
    // retrieving in it id, bio, username, firstname and lastname
    const comments = await models.Comment.findAll({
      where: {
        postId: req.params.id,
      },
      order: [order != null ? order.split(":") : ["createdAt", "ASC"]],
      attributes: fields != "*" && fields != null ? fields.split(",") : null,
      include: [
        {
          model: models.User,
          attributes: [
            "username",
            "id",
            "attachment",
            "firstname",
            "lastname",
            "bio",
          ],
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

/** used to create a comment */
exports.createComment = async (req, res) => {
  if (req.body.commentContent.length < 65000) {
    // create the new comment
    try {
      const newComment = await models.Comment.create({
        userId: req.body.userId,
        postId: req.body.postId,
        content: req.body.commentContent,
      });
      res.status(201).json({ newCommentId: newComment.id });
    } catch (error) {
      res.status(400).json({ error })
    }

  } else {
    res.status(500).json({ error: "Comment is too long" });
  }
};

/** used to modify a comment
 * we determine if the user is allowed to perform the action
 * then we modify the comment
 */
exports.modifyComment = async (req, res) => {

  // verify first that the content length is correct
  if (req.body.content.length < 65000) {

    const newContent = req.body.content;

    // determine who is allowed to perform the action
    let allowed = functions.isAllowed(req);

    // determine the comment to modify
    const commentToModify = await models.Comment.findOne({ where: { id: req.params.id } });

    // verify that the user is the owner
    if (allowed.userIdFromToken === commentToModify.userId) {

      // modify the content
      commentToModify.content = newContent;

      // save the changes
      commentToModify.save()
        .then(
          res.status(200).json({
            commentUpdate: "Comment updated !",
            updatedContent: newContent,
          })
        )
        .catch((error) => res.status(500).json({ error }));
    }
    else {
      // the user is not allowed to perform the action
      res.status(500).json({ error: "user not allowed to use this fonction" });
    }




  } else {
    res.status(500).json({ error: "Comment is too long" });
  }
};

/** used to delete a comment
 * we determine if the user is allowed to perform the action
 * then we delete the comment
 */
exports.deleteComment = async (req, res) => {

  // determine who is allowed to perform the action
  let allowed = functions.isAllowed(req);

  // determine the comment to delete
  const commentToDestroy = await models.Comment.findOne({ where: { id: req.params.id } });

  // verify that the user is the owner or an admin
  if ((allowed.userIdFromToken === commentToDestroy.userId) || (allowed.isAdminFromToken === 1)) {

    // destroy the comment
    commentToDestroy.destroy()
      .then(() => res.status(200).json({ post: "Comment deleted !" }))
      .catch((error) => res.status(400).json({ error }));
  }
  else {
    // the user is not allowed to perform the action
    res.status(500).json({ error: "user not allowed to use this fonction" });
  }
};
