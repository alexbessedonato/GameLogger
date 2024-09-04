const express = require("express");
const app = express();
const port = 3000;

// Importar los modelos y la función de sincronización
const { syncModels } = require("./models");
const gameRoutes = require("./routes/games"); // Importamos las rutas de juegos
const userRoutes = require("./routes/users"); // Importar las rutas de usuarios

// Sincronizar los modelos al arrancar el servidor
syncModels();

app.use(express.json());

app.use("/games", gameRoutes);

app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
