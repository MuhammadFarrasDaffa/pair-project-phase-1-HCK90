'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserProducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references:{
          model: "Users",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      productId: {
        type: Sequelize.INTEGER,
        references:{
          model: "Products",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      itemProduct: {
        type: Sequelize.STRING
      },
      itemQuantity: {
        type: Sequelize.INTEGER
      },
      itemPrice: {
        type: Sequelize.INTEGER
      },
      totalPrice: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserProducts');
  }
};