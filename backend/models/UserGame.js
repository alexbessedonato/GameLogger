// models/UserGame.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/config"); // Import sequelize instance
const User = require("./user"); // Import User model

// Define the UserGame model
const UserGame = sequelize.define("UserGame", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Wishlisted", "Playing", "Completed", "100%ed"),
    allowNull: false,
    defaultValue: "Wishlisted",
  },
  startedOn: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  finishedOn: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  cover: {
    type: DataTypes.STRING, // URL for cover image
    allowNull: true,
  },
});

// Establish the association between User and UserGame
UserGame.belongsTo(User, {
  foreignKey: "userId", // Foreign key in the UserGame table pointing to User
  allowNull: false,
});

// Sync the models with the database
sequelize.sync({ alter: true });

module.exports = UserGame;
