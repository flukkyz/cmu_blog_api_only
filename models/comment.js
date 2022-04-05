'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id'
      })
      this.belongsTo(models.Post, {
        foreignKey: 'post_id'
      })
    }
  }
  Comment.init({
    comment: DataTypes.TEXT,
    post_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    underscored: true,
    tableName: 'comments',
    modelName: 'Comment',
  })
  Comment.inputSchema = {
    comment: 'required'
  }
  return Comment
}
