'use strict'
const fs = require('fs')
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Img extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Img.init({
    url: DataTypes.STRING,
    path: DataTypes.STRING
  }, {
    hooks: {
      beforeDestroy: (img, options) => {
        if (fs.existsSync(img.path)) {
          fs.unlink(img.path, (err) => {
            if (err) {
              console.error(err)
              return
            }
          })
        }
      }
    },
    sequelize,
    timestamps: false,
    tableName: 'imgs',
    modelName: 'Img',
  })
  Img.beforeBulkDestroy(function (options) {
    options.individualHooks = true
    return options
  })
  return Img
}