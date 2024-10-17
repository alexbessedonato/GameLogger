const axios = require("axios");

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

const getAuthToken = async () => {
  try {
    const response = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      null,
      {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "client_credentials",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error al obtener el token de autenticación:", error.message);
    throw new Error("No se pudo obtener el token de autenticación");
  }
};

const searchGames = async (searchQuery) => {
  try {
    const accessToken = await getAuthToken();

    const response = await axios.post(
      "https://api.igdb.com/v4/games",
      `search "${searchQuery}"; fields name,cover.url,summary;`, // Formato correcto
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const games = response.data.map((game) => {
      return {
        name: game.name || "No Name Available",
        summary: game.summary || "No Summary Available",
        cover: game.cover ? `https:${game.cover.url}` : "No Cover Available",
      };
    });

    console.log("Juegos obtenidos:", games);
    return games;
  } catch (error) {
    console.error("Error al buscar juegos en IGDB:", error.message);
    throw new Error("Error al buscar juegos en IGDB");
  }
};

// Función para obtener los juegos mejor valorados
const getTopRatedGames = async () => {
  try {
    const accessToken = await getAuthToken();

    const response = await axios.post(
      "https://api.igdb.com/v4/games", // POST in IGDB
      `fields name,cover.url,summary,aggregated_rating,aggregated_rating_count;
       where aggregated_rating > 0;
       where aggregated_rating_count > 10;
       sort aggregated_rating desc;
       limit 15;`, // Filter to get top-rated games
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const games = response.data.map((game) => ({
      name: game.name || "No Name Available",
      summary: game.summary || "No Summary Available",
      cover: game.cover ? `https:${game.cover.url}` : "No Cover Available",
      rating: game.aggregated_rating
        ? game.aggregated_rating.toFixed(2)
        : "No Rating Available", // Format to 2 decimal places
    }));

    console.log("Top 10 Juegos mejor valorados:", games);
    return games;
  } catch (error) {
    console.error(
      "Error al obtener los juegos mejor valorados en IGDB:",
      error.message
    );
    throw new Error("Error al obtener los juegos mejor valorados en IGDB");
  }
};

const getGameDetails = async (gameName) => {
  try {
    const accessToken = await getAuthToken();

    const query = `search "${gameName}"; 
      fields name,summary,cover.url,franchises.name,genres.name,involved_companies.company.name,platforms.name,parent_game.name,rating,rating_count,screenshots.url,storyline,total_rating,url,videos.video_id,dlcs.name,hypes,first_release_date;
      limit 1;`;

    console.log("Headers for IGDB request:", {
      "Client-ID": clientId,
      Authorization: `Bearer ${accessToken}`,
    });

    const response = await axios.post("https://api.igdb.com/v4/games", query, {
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${accessToken}`, // Correct formatting for Bearer token
        Accept: "application/json",
      },
    });

    console.log("Response from IGDB:", response.data); // Log the full IGDB response for debugging

    if (response.data.length === 0) {
      throw new Error("No game found with that name");
    }

    // Format total_rating to 2 decimal places if it exists
    const game = response.data[0];

    if (game.rating) {
      game.rating = game.rating.toFixed(2);
    }

    if (game.total_rating) {
      game.total_rating = game.total_rating.toFixed(2);
    }

    // Limit screenshots and videos to a maximum of 6 items
    game.screenshots = game.screenshots ? game.screenshots.slice(0, 6) : [];
    game.videos = game.videos ? game.videos.slice(0, 2) : [];

    return game; // Return the game details
  } catch (error) {
    console.error("Error fetching game details from IGDB:", error.message);
    throw new Error("Error fetching game details from IGDB");
  }
};

module.exports = {
  searchGames,
  getTopRatedGames,
  getGameDetails, // Export the updated function
};
