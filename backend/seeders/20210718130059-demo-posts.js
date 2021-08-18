/**
 * posts of demo version when using sequelize db:seed:all
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
    return queryInterface.bulkInsert("Posts", [
      {
        id: 1,
        userId: 1,
        content: "C'est là que je rève d'aller !!! Me préparer une cagnotte serait une super idée surprise !!! (On peut toujours réver)",
        attachment: "images/1.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        likers: "[2,3,4,5]"
      },
      {
        id: 2,
        userId: 2,
        content: "La lune est belle ce soir !",
        attachment: "images/2.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        likers: "[1,3,4,5]"
      },
      {
        id: 3,
        userId: 3,
        content: "Majestueux ! Les grands hommes et les grandes femmes du passé nous saluent.",
        attachment: "images/3.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        likers: "[1,2,4,5]"
      },
      {
        id: 4,
        userId: 4,
        content: "Ma femme est magnifique ! Rien de professionnel mais j'avais envie de partager !",
        attachment: "images/4.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        likers: "[1,2]"
      },
      {
        id: 5,
        userId: 5,
        content: "Limpide,sereine mais un peu dispersée... Cette eau me ressemble",
        attachment: "images/5.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        likers: "[5]"
      },
      {
        id: 6,
        userId: 6,
        content: "J'avais l'âme d'un poète ce matin, mais je vais vous épargner ma prose :)",
        attachment: "images/6.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        likers: "[8,9,3,4,5]"
      },
      {
        id: 7,
        userId: 7,
        content: "Papillon du matin, journée qui commence bien",
        attachment: "images/7.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        likers: "[1,4,5]"
      },
      {
        id: 8,
        userId: 8,
        content: "La vie est très belle ici !",
        attachment: "images/8.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        likers: "[8,5]"
      },
      {
        id: 9,
        userId: 9,
        content: "Traversée du bosphore pour nous ce matin. Grosses pensées à ceux qui travaillent !!!",
        attachment: "images/9.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        likers: "[10,4,5]"
      },
      {
        id: 10,
        userId: 10,
        content: "Un regard profond...         J'aime",
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
     return await queryInterface.bulkDelete("Posts", null, {});
  },
};
