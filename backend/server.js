const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const { searchGames } = require("./services/igdbService.js"); // Cambia esto por el nombre correcto de tu servicio
const { getTopRatedGames } = require("./services/igdbService.js"); // Cambia esto por el nombre correcto de tu servicio

const app = express();
const port = process.env.PORT || 5000;

console.log("Client ID:", process.env.TWITCH_CLIENT_ID);
console.log("Client Secret:", process.env.TWITCH_CLIENT_SECRET);

app.use(cors()); // Habilitar CORS
app.use(express.json()); // Habilitar JSON en las solicitudes

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

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
