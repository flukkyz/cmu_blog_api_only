'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id'
      })
      this.belongsTo(models.Img, {
        foreignKey: 'img_id'
      })
      this.hasMany(models.Comment, {
        foreignKey: 'post_id'
      })
    }
  }
  Post.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    type: {
      type: DataTypes.ENUM('general', 'sport', 'technology', 'entertainment', 'lifestyle', 'other'),
      defaultValue: 'general',
    },
    img_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
  }, {
    hooks: {
      beforeDestroy: async (post, options) => {
        let oldImg = await post.getImg()
        if (oldImg) {
          oldImg.destroy()
        }
        let comments = await post.getComments()
        if(comments){
          comments.forEach(comment => comment.destroy())
        }
      }
    },
    sequelize,
    underscored: true,
    tableName: 'posts',
    modelName: 'Post',
  })
  Post.inputSchema = {
    title: 'required',
    type: 'required'
  }
  Post.beforeBulkDestroy(function (options) {
    options.individualHooks = true
    return options
  })
  return Post
}
