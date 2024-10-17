// routes/gameLibrary.js
const express = require("express");
const UserGame = require("./models/UserGame"); // Import the UserGame model
const User = require("./models/User"); // Import the User model
const router = express.Router();

// POST /api/user-games - Add a game to the user's library
router.post("/user-games", async (req, res) => {
  try {
    const { name, cover, userId } = req.body; // Include userId in the request
    const newGame = await UserGame.create({
      name,
      cover,
      userId, // Link the game to the user
    });
    res.status(201).json(newGame);
  } catch (error) {
    console.error("Error adding game:", error);
    res.status(500).json({ error: "Failed to add game to the library" });
  }
});

// PUT /api/user-games/:id - Update the status, dates, and more for a specific game
router.put("/user-games/:id", async (req, res) => {
  try {
    const { status, startedOn, finishedOn } = req.body;
    const game = await UserGame.findByPk(req.params.id);
    if (game) {
      game.status = status;
      game.startedOn = startedOn || null;
      game.finishedOn = finishedOn || null;
      await game.save();
      res.status(200).json(game);
    } else {
      res.status(404).json({ error: "Game not found" });
    }
  } catch (error) {
    console.error("Error updating game:", error);
    res.status(500).json({ error: "Failed to update game" });
  }
});

// GET /api/user-games?status=&userId= - Fetch games by status and userId
router.get("/user-games", async (req, res) => {
  try {
    const { status, userId } = req.query;
    const games = await UserGame.findAll({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
    });
    res.status(200).json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ error: "Failed to fetch games" });
  }
});

module.exports = router;
