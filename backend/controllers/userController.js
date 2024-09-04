const User = require("../models/user");

// Controlador para crear un nuevo usuario
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const newUser = await User.create({
      name,
      email,
      password, // Nota: Idealmente deberías cifrar la contraseña con bcrypt antes de almacenarla
    });
    res.status(201).json(newUser); // Retorna el usuario creado
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

// Controlador para obtener todos los usuarios
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll(); // Obtiene todos los usuarios de la base de datos
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};
