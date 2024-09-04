const { Sequelize } = require("sequelize");

// Conexión a PostgreSQL en Docker
const sequelize = new Sequelize("postgres", "postgres", "mysecretpassword", {
  host: "localhost", // Usamos localhost porque Docker expone el puerto
  dialect: "postgres", // Especificamos que es PostgreSQL
  port: 5432, // Puerto donde corre PostgreSQL en Docker
});

// Verifica la conexión
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión a la base de datos exitosa.");
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
  });

module.exports = sequelize;
