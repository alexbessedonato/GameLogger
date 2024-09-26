const { Sequelize } = require("sequelize"); // Import Sequelize

// Initialize Sequelize with your database credentials
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres", // Specify the dialect (e.g., 'postgres')
    logging: false, // Disable logging if you prefer
    port: process.env.DB_PORT || 5432, // Optional: Define the port, default is 5432 for PostgreSQL
  }
);

// Export sequelize for use in other files
module.exports = sequelize;
