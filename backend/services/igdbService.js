const axios = require("axios");
require("dotenv").config(); // Cargar las variables de entorno

const clientId = process.env.TWITCH_CLIENT_ID; // Obtener el Client ID desde el .env
const clientSecret = process.env.TWITCH_CLIENT_SECRET; // Obtener el Client Secret desde el .env

// Función para obtener el token de autenticación de Twitch
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
    return response.data.access_token; // Retorna el token de acceso
  } catch (error) {
    console.error("Error al obtener el token de autenticación:", error);
  }
};

// Función para buscar videojuegos en la API de IGDB
const searchGames = async (searchQuery) => {
  const token = await getAuthToken(); // Obtiene el token de acceso
  try {
    const response = await axios.post(
      "https://api.igdb.com/v4/games",
      `search "${searchQuery}"; fields name,cover.url,summary;`,
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Retorna los datos obtenidos de IGDB
  } catch (error) {
    console.error("Error al buscar juegos en IGDB:", error);
  }
};

module.exports = {
  searchGames,
};
