const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const User = require("./user"); // Import User model

const UserGames = sequelize.define("UserGames", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User, // Link to User model
      key: "username", // Reference username in the User table
    },
    onDelete: "CASCADE", // Optional: if a user is deleted, delete their games too
  },
  gameName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Wishlisted", "Playing", "Completed", "100%ed"),
    allowNull: false,
    defaultValue: "Wishlisted", // Default status
  },
  startedOn: {
    type: DataTypes.DATE,
    allowNull: true, // Nullable if not started yet
  },
  finishedOn: {
    type: DataTypes.DATE,
    allowNull: true, // Nullable if not finished yet
  },
  // Add cover field for storing the cover image URL
  cover: {
    type: DataTypes.STRING,
    allowNull: true, // Nullable in case there's no cover available
  },
});

module.exports = UserGames;
