'use strict';

const { Profile } = require('../models/index')

const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const password = "farrasfarhan"
    const hash = bcrypt.hashSync(password, 10);

    const data = [{username: "mfarrasdaffa", email:"daffamfd27@gmail.com", password:hash, role:"admin", createdAt : new Date(), updatedAt : new Date() }]

    await queryInterface.bulkInsert("Users", data, {})

    await Profile.create({userId : 1})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
