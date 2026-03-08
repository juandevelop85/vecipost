const { DataTypes } = require('sequelize');
const postgresDB = require('../db/postgresDB').default;

const User = postgresDB.instance.db.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password_reset_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password_reset_expiry: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;
