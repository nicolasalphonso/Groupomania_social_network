/** model of a new post */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User);
      this.hasMany(models.Comment);
    }
  }
  Post.init(
    {
      userId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      attachment: DataTypes.STRING,
      likers: {
        type: DataTypes.JSON,
        defaultValue: [],
        
      },
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
