'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      account_name: {
        type: Sequelize.STRING(191),
        allowNull: false,
        unique: true
      },
      current_login: {
        type: Sequelize.DATE
      },
      last_login: {
        type: Sequelize.DATE
      },
      current_ip: {
        type: Sequelize.STRING
      },
      last_ip: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.ENUM('admin', 'user'),
        defaultValue: 'user',
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
    }).then(() => queryInterface.addIndex('users', [
      'account_name',
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
  }
}
