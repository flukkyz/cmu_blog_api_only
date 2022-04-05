'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.ENUM('general', 'sport', 'technology', 'entertainment', 'lifestyle', 'other'),
        defaultValue: 'general',
      },
      img_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        field: 'created_at',
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        field: 'updated_at',
        type: Sequelize.DATE
      }
    }).then(() => queryInterface.addIndex('posts', [
      'img_id'
    ])).then(() => queryInterface.addIndex('posts', [
      'user_id'
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('posts')
  }
}
