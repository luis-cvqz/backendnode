'use strict';

const { sequelize } = require('../models');
const categoria = require('../models/categoria');
const pelicula = require('../models/pelicula');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('categoriapelicula', {
      categoriaid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'categoria',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      peliculaid: {
        allowNull: false,
        primaryKey: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'pelicula',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('categoriapelicula');
  }
};
