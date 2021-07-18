"use strict";
require('dotenv').config();
const bcrypt = require("bcrypt");
const { Hash } = require("crypto");
const cryptojs = require("crypto-js");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("Users", [
      {
        firstname: "John",
        lastname: "Doe",
        email: cryptojs
          .HmacSHA256(
            "johndoe@groupomania.com",
            process.env.EMAIL_KEY_SECRET
          )
          .toString(),
        username: "johndoe",
        password: await bcrypt.hash("password", 10),
        bio: "lorem ipsum",
        isAdmin: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: "Nicolas",
        lastname: "Alphonso",
        email: cryptojs
          .HmacSHA256(
            "nicolasalphonso@groupomania.com",
            process.env.EMAIL_KEY_SECRET
          )
          .toString(),
        username: "nicolasalphonso",
        password: await bcrypt.hash("password", 10),
        bio: "lorem ipsum",
        isAdmin: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: "Nancy",
        lastname: "Alphonso",
        email: cryptojs
          .HmacSHA256(
            "nnancyalphonso@groupomania.com",
            process.env.EMAIL_KEY_SECRET
          )
          .toString(),
        username: "nancyalphonso",
        password: await bcrypt.hash("password", 10),
        bio: "lorem ipsum",
        isAdmin: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: "James",
        lastname: "Brown",
        email: cryptojs
          .HmacSHA256(
            "jamesbrown@groupomania.com",
            process.env.EMAIL_KEY_SECRET
          )
          .toString(),
        username: "jamesbrown",
        password: await bcrypt.hash("password", 10),
        bio: "lorem ipsum",
        isAdmin: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: "Serena",
        lastname: "Williams",
        email: cryptojs
          .HmacSHA256(
            "serenawilliams@groupomania.com",
            process.env.EMAIL_KEY_SECRET
          )
          .toString(),
        username: "serenawilliams",
        password: await bcrypt.hash("password", 10),
        bio: "lorem ipsum",
        isAdmin: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: "Abdoul",
        lastname: "Kachama",
        email: cryptojs
          .HmacSHA256(
            "abdoulkachama@groupomania.com",
            process.env.EMAIL_KEY_SECRET
          )
          .toString(),
        username: "abdoulkachama",
        password: await bcrypt.hash("password", 10),
        bio: "lorem ipsum",
        isAdmin: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: "Suzanne",
        lastname: "Makanaki",
        email: cryptojs
          .HmacSHA256(
            "suzannemakanaki@groupomania.com",
            process.env.EMAIL_KEY_SECRET
          )
          .toString(),
        username: "suzannemakanaki",
        password: await bcrypt.hash("password", 10),
        bio: "lorem ipsum",
        isAdmin: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: "Antoine",
        lastname: "Durand",
        email: cryptojs
          .HmacSHA256(
            "antoinedurand@groupomania.com",
            process.env.EMAIL_KEY_SECRET
          )
          .toString(),
        username: "antoinedurand",
        password: await bcrypt.hash("password", 10),
        bio: "lorem ipsum",
        isAdmin: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: "Delphine",
        lastname: "Cossard",
        email: cryptojs
          .HmacSHA256(
            "delphinecossard@groupomania.com",
            process.env.EMAIL_KEY_SECRET
          )
          .toString(),
        username: "delphinecossard",
        password: await bcrypt.hash("password", 10),
        bio: "lorem ipsum",
        isAdmin: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: "Henriette",
        lastname: "Dupond",
        email: cryptojs
          .HmacSHA256(
            "henriettedupond@groupomania.com",
            process.env.EMAIL_KEY_SECRET
          )
          .toString(),
        username: "henriettedupond",
        password: await bcrypt.hash("password", 10),
        bio: "lorem ipsum",
        isAdmin: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Users", null, {});
  },
};
