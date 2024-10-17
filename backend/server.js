const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/config"); // The Sequelize instance
const User = require("./models/user"); // Import the User model
const UserGames = require("./models/userGame"); // Make sure the path is correct
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes"); // Ensure path is correct
const gameLibraryRoutes = require("./routes/gameLibrary.js"); // Import the game library routes

console.log("DB Password:", process.env.DB_PASSWORD);

// Sync all models and alter the database schema to match the models
sequelize
  .sync({ alter: true }) // Ensures the schema is updated
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

const { searchGames } = require("./services/igdbService.js");
const { getTopRatedGames } = require("./services/igdbService.js");
const { getGameDetails } = require("./services/igdbService.js");

const app = express();
const port = process.env.PORT || 5000;

console.log("Client ID:", process.env.TWITCH_CLIENT_ID);
console.log("Client Secret:", process.env.TWITCH_CLIENT_SECRET);

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/api", gameLibraryRoutes); // Use the game library routes

// Ruta POST para buscar juegos
app.post("/api/games", async (req, res) => {
  const searchQuery = req.body.search;
  try {
    const games = await searchGames(searchQuery);
    res.json(games);
  } catch (error) {
    console.error("Error fetching games from IGDB:", error.message);
    res.status(500).json({ error: "Error fetching games from IGDB" });
  }
});

// Endpoint POST para obtener los 10 juegos mejor valorados
app.post("/api/top-rated-games", async (req, res) => {
  try {
    const topGames = await getTopRatedGames();
    res.json(topGames);
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
    const hashedPassword = await bcrypt.hash(password, 10);
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
  const { game_name } = req.body;
  try {
    const gameDetails = await getGameDetails(game_name);
    res.json(gameDetails);
  } catch (error) {
    res.status(500).json({ error: "Error fetching game details from IGDB" });
  }
});

// Endpoint to update the game info in the user's library
app.put("/api/update-game", async (req, res) => {
  const { username, gameName, status, startedOn, finishedOn } = req.body;

  try {
    const gameEntry = await UserGames.findOne({
      where: { username, gameName },
    });

    if (!gameEntry) {
      return res.status(404).json({ error: "Game not found in library" });
    }

    gameEntry.status = status;
    gameEntry.startedOn = startedOn || null;
    gameEntry.finishedOn = finishedOn || null;

    await gameEntry.save();

    return res.status(200).json(gameEntry);
  } catch (error) {
    console.error("Error updating game:", error);
    return res.status(500).json({ error: "Error updating game in library" });
  }
});

// Endpoint to fetch the user's library
app.get("/api/user-library", async (req, res) => {
  const { username } = req.query;

  try {
    const games = await UserGames.findAll({ where: { username } });
    res.json(games);
  } catch (error) {
    console.error("Error fetching user library:", error);
    return res.status(500).json({ error: "Error fetching user library" });
  }
});

// POST route to handle login
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
