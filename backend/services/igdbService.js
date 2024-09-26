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
      "https://api.igdb.com/v4/games", // POST en IGDB
      `fields name,cover.url,summary,aggregated_rating,aggregated_rating_count;
       where aggregated_rating > 0;
       where aggregated_rating_count > 10;
       sort aggregated_rating desc;
       limit 15;`, // Filtro para obtener los juegos mejor valorados
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
      rating: game.aggregated_rating || "No Rating Available",
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

module.exports = {
  searchGames,
  getTopRatedGames,
};
