"use strict";

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
    return queryInterface.bulkInsert("Posts", [
      {
        id: 1,
        userId: 1,
        content: "premier post de 1",
        attachment: "images/1.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        likers: "[2,3,4,5]"
      },
      {
        id: 2,
        userId: 2,
        content: "premier post de 2",
        attachment: "images/2.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        likers: "[1,3,4,5]"
      },
      {
        id: 3,
        userId: 3,
        content: "premier post de 3",
        attachment: "images/3.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        likers: "[1,2,4,5]"
      },
      {
        id: 4,
        userId: 4,
        content: "premier post de 4",
        attachment: "images/4.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        likers: "[1,2]"
      },
      {
        id: 5,
        userId: 5,
        content: "premier post de 5",
        attachment: "images/5.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        likers: "[5]"
      },
      {
        id: 6,
        userId: 6,
        content: "premier post de 6",
        attachment: "images/6.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        likers: "[8,9,3,4,5]"
      },
      {
        id: 7,
        userId: 7,
        content: "premier post de 7",
        attachment: "images/7.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        likers: "[1,4,5]"
      },
      {
        id: 8,
        userId: 8,
        content: "premier post de 8",
        attachment: "images/8.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        likers: "[8,5]"
      },
      {
        id: 9,
        userId: 9,
        content: "premier post de 9",
        attachment: "images/9.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        likers: "[10,4,5]"
      },
      {
        id: 10,
        userId: 10,
        content: "premier post de 10",
        attachment: "images/10.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        likers: "[7,8,9]"
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
     return queryInterface.bulkDelete("Posts", null, {});
  },
};
