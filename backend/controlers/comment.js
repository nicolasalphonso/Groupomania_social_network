const models = require("../models"); // import of models
const jwt = require("jsonwebtoken"); // import of JSON web token
const comment = require("../models/comment");
const dotenv = require("dotenv").config({ path: "../" }); // import of environment variables

// get comments of a post
exports.getComments = async (req, res, next) => {
  try {
    const fields = req.query.fields;
    const order = req.query.order;

    // use of sequelize syntax, on table posts using a left outer join on users
    // retrieving in it username, firstname and lastname
    const comments = await models.Comment.findAll({
      where: {
        postId: req.params.id,
      },
      order: [order != null ? order.split(":") : ["createdAt", "ASC"]],
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

// Create a comment
exports.createComment = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);

  console.log(req.body);
  if (decodedToken.userId === req.body.userId) {
    const newComment = await models.Comment.create({
      userId: decodedToken.userId,
      postId: req.body.postId,
      content: req.body.commentContent,
    })
      .catch((error) => res.status(400).json({ error }));

      res.status(201).json({newCommentId: newComment.id})
  }
};


//  modify comment
exports.modifyComment = async (req, res, next) => {

  const newContent = req.body.content;

  await models.Comment.findOne({ where: { id: req.params.id } })
    .then((comment) => {
      comment.content = newContent;
      comment.save();
    })
    .then(
      res
        .status(200)
        .json({ commentUpdate: "Comment updated !", updatedContent: newContent })
    )
    .catch((error) => res.status(500).json({ error }));
};


// deleting a comment - destroy method
exports.deleteComment = async (req, res, next) => {
  await models.Comment.findOne({ where: { id: req.params.id } })
    .then((comment) => {
      models.Comment.destroy({
        where: {
          id: req.params.id,
        },
      })
        .then(() => res.status(200).json({ post: "Comment deleted !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
