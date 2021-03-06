'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      posts.hasMany(models.posts_comments);
      posts.hasMany(models.posts_events);
    }
  };
  posts.init({
    name: DataTypes.STRING,
    content: DataTypes.STRING,
    user_email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'posts',
    underscored: true,
  });
  return posts;
};