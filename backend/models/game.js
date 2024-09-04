const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Importa la conexión de la base de datos

const Game = sequelize.define(
  "Game",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true, // La descripción es opcional
    },
    status: {
      type: DataTypes.ENUM("playing", "completed", "wishlist"),
      allowNull: false,
    },
    coverImage: {
      type: DataTypes.STRING, // Almacenará la URL de la imagen de la carátula
      allowNull: true, // Este campo es opcional, puede que no todos los juegos tengan carátula
    },
  },
  {
    timestamps: true, // Para createdAt y updatedAt automáticos
  }
);

module.exports = Game;
