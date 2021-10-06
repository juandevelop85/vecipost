'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posts_events extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      posts_events.belongsTo(models.posts, { foreignKey: 'post_id' });
    }
  };
  posts_events.init({
    post_id: DataTypes.INTEGER,
    user_email: DataTypes.STRING,
    like: DataTypes.INTEGER,
    dislike: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'posts_events',
    underscored: true,
  });
  return posts_events;
};