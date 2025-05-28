const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.DATABASE_URL) {
  // Use DATABASE_URL in production (e.g., Render)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for some managed DBs like Render
      },
    },
    logging: false,
  });
} else {
  // Local development with individual DB params
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      dialect: "postgres",
      logging: false,
    }
  );
}

module.exports = sequelize;
