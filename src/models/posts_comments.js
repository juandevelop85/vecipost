'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posts_comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      posts_comments.belongsTo(models.posts);
    }
  };
  posts_comments.init({
    post_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    content: DataTypes.STRING,
    user_email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'posts_comments',
    underscored: true,
  });
  return posts_comments;
};