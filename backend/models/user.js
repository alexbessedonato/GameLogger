const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Importa la instancia de Sequelize desde database.js

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false, // El nombre es obligatorio
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // El correo debe ser único
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // La contraseña también es obligatoria
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt por defecto
  }
);

module.exports = User;
