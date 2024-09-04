const Game = require("../models/game"); // Importa el modelo

exports.addGame = async (req, res) => {
  const { userId, title, description, status, coverImage } = req.body; // Información del cuerpo de la solicitud

  try {
    const newGame = await Game.create({
      // Crea el juego en la base de datos
      userId,
      title,
      description,
      status,
      coverImage,
    });
    res.status(201).json(newGame); // Devuelve el juego creado
  } catch (err) {
    res.status(500).json({ error: "Error al añadir el juego" });
  }
};

exports.getGames = async (req, res) => {
  const { userId } = req.query; // Obtener el ID del usuario desde la URL

  try {
    const games = await Game.findAll({
      // Buscar todos los juegos que pertenezcan al usuario
      where: { userId },
    });
    res.status(200).json(games); // Devuelve los juegos encontrados
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los juegos" });
  }
};

exports.updateGame = async (req, res) => {
  const { id } = req.params; // El ID del juego que queremos actualizar
  const { status, title, description, coverImage } = req.body;

  try {
    const game = await Game.findByPk(id); // Buscar el juego por su ID

    if (game) {
      // Actualizar los campos si se proporcionaron nuevos valores
      game.status = status || game.status;
      game.title = title || game.title;
      game.description = description || game.description;
      game.coverImage = coverImage || game.coverImage;

      await game.save(); // Guardar los cambios en la base de datos
      res.status(200).json(game); // Devuelve el juego actualizado
    } else {
      res.status(404).json({ error: "Juego no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar el juego" });
  }
};

exports.deleteGame = async (req, res) => {
  const { id } = req.params; // El ID del juego a eliminar

  try {
    const game = await Game.findByPk(id); // Buscar el juego por su ID

    if (game) {
      await game.destroy(); // Eliminar el juego
      res.status(204).json(); // Respuesta sin contenido
    } else {
      res.status(404).json({ error: "Juego no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar el juego" });
  }
};
