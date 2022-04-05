'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Post, {
        foreignKey: 'user_id'
      })
      this.hasMany(models.Comment, {
        foreignKey: 'user_id'
      })
    }
  }
  User.init({
    account_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    current_login: DataTypes.DATE,
    last_login: DataTypes.DATE,
    current_ip: DataTypes.STRING,
    last_ip: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user',
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'users',
    modelName: 'User',
  })
  return User
}
