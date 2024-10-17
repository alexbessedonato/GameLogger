const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/config"); // The Sequelize instance
const User = require("./models/user"); // Import the User model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes"); // Ensure path is correct

console.log("DB Password:", process.env.DB_PASSWORD);

// Sync all models
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

const { searchGames } = require("./services/igdbService.js"); // Cambia esto por el nombre correcto de tu servicio
const { getTopRatedGames } = require("./services/igdbService.js"); // Cambia esto por el nombre correcto de tu servicio
const { getGameDetails } = require("./services/igdbService.js");

const app = express();
const port = process.env.PORT || 5000;

console.log("Client ID:", process.env.TWITCH_CLIENT_ID);
console.log("Client Secret:", process.env.TWITCH_CLIENT_SECRET);

app.use(cors()); // Habilitar CORS
app.use(express.json()); // Habilitar JSON en las solicitudes
app.use(bodyParser.json());

// Ruta POST para buscar juegos
app.post("/api/games", async (req, res) => {
  const searchQuery = req.body.search; // Tomar el término de búsqueda del cuerpo de la solicitud
  try {
    const games = await searchGames(searchQuery); // Llamar al servicio para buscar juegos
    res.json(games); // Enviar los resultados al cliente
  } catch (error) {
    res.status(500).json({ error: "Error al buscar juegos en IGDB" });
  }
});

// Endpoint POST para obtener los 10 juegos mejor valorados
app.post("/api/top-rated-games", async (req, res) => {
  try {
    const topGames = await getTopRatedGames();
    res.json(topGames); // Enviar los juegos al cliente
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener los juegos mejor valorados" });
  }
});

// Signup route
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "User could not be created." });
  }
});

app.post("/api/game-details", async (req, res) => {
  const { game_name } = req.body; // Extract the game name from the request body
  try {
    const gameDetails = await getGameDetails(game_name); // Call the service to fetch the game details
    res.json(gameDetails); // Send the game details as a JSON response
  } catch (error) {
    res.status(500).json({ error: "Error fetching game details from IGDB" });
  }
});

// POST route to handle login
app.use("/auth", authRoutes); // Prefix for authentication routes

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
