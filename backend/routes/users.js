const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Importamos el controlador

// POST /games: Añadir un nuevo juego
router.post("/", userController.createUser);

// GET /games: Obtener la lista de juegos de un usuario
router.get("/", userController.getUsers);

module.exports = router;
