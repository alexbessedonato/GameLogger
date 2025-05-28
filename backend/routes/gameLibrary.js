const express = require("express");
const UserGames = require("../models/UserGame"); // Import the UserGames model
const router = express.Router();

// POST /api/user-games - Add a game to the user's library
router.post("/user-games", async (req, res) => {
  try {
    const { gameName, cover, username, status } = req.body;

    // Store the `t_thumb` version in the database
    const thumbCover = cover || null;

    // Create a new entry in UserGames
    const newGame = await UserGames.create({
      gameName,
      cover: thumbCover, // Save the thumb cover URL (unmodified)
      username,
      status: status || "Wishlisted", // Default to 'Wishlisted' if no status is provided
    });

    res.status(201).json(newGame);
  } catch (error) {
    console.error("Error adding game:", error);
    res.status(500).json({ error: "Failed to add game to the library" });
  }
});

// PUT /api/user-games - Update the status, dates, and more for a specific game by username and gameName
router.put("/user-games", async (req, res) => {
  const { username, gameName, status, startedOn, finishedOn } = req.body;

  try {
    // Find the game entry by username and gameName
    const gameEntry = await UserGames.findOne({
      where: { username, gameName },
    });

    if (!gameEntry) {
      return res.status(404).json({ error: "Game not found in library" });
    }

    // Update the game entry with new status and dates
    gameEntry.status = status || gameEntry.status;
    gameEntry.startedOn = startedOn || gameEntry.startedOn;
    gameEntry.finishedOn = finishedOn || gameEntry.finishedOn;

    await gameEntry.save(); // Save the updated game entry

    return res.status(200).json(gameEntry); // Send the updated game entry back
  } catch (error) {
    console.error("Error updating game:", error);
    res.status(500).json({ error: "Failed to update game" });
  }
});

// GET /api/user-library - Fetch games by username
router.get("/user-library", async (req, res) => {
  try {
    const { username } = req.query;

    const games = await UserGames.findAll({ where: { username } });

    // Modify the cover URL to return the 1080p version for display
    const formattedGames = games.map((game) => {
      return {
        ...game.dataValues,
        cover: game.cover ? game.cover.replace("t_thumb", "t_1080p") : null,
      };
    });

    res.status(200).json(formattedGames);
  } catch (error) {
    console.error("Error fetching user library:", error);
    res.status(500).json({ error: "Failed to fetch user library" });
  }
});

module.exports = router;
