const express = require("express");
const router = express.Router();
const gamesController = require("../controllers/gamesController"); // Importamos el controlador

// POST /games: Añadir un nuevo juego
router.post("/", gamesController.addGame);

// GET /games: Obtener la lista de juegos de un usuario
router.get("/", gamesController.getGames);

// PUT /games/:id: Actualizar el estado de un juego
router.put("/:id", gamesController.updateGame);

// DELETE /games/:id: Eliminar un juego
router.delete("/:id", gamesController.deleteGame);

module.exports = router;
