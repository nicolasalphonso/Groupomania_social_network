/**
 * comments of demo version when using sequelize db:seed:all
 */
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
    return queryInterface.bulkInsert("Comments", [
      {
        id: 1,
        userId: 2,
        postId: 1,
        content:
          "La cagnotte est prête... dans tes rèves :)",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        userId: 1,
        postId: 1,
        content:
          "Merci de briser mes rèves !!! Grrrrrr !",
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
    return await queryInterface.bulkDelete("Comments", null, {});
  },
};
