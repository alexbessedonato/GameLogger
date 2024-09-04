const User = require("./user"); // Importa el modelo User
const Game = require("./game"); // Importa el modelo Game

// Definir la relación "Un usuario tiene muchos juegos"
User.hasMany(Game, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Game.belongsTo(User, {
  foreignKey: "userId",
});

// Sincronizar todos los modelos
const syncModels = async () => {
  try {
    await User.sync();
    console.log("Tabla de Usuarios sincronizada correctamente.");
    await Game.sync();
    console.log("Tabla de Juegos sincronizada correctamente.");
  } catch (err) {
    console.error("Error al sincronizar las tablas:", err);
  }
};

module.exports = {
  User,
  Game,
  syncModels,
};
