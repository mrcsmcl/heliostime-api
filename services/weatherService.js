const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

async function getWeather(lat, lon) {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Erro ao obter dados climáticos:', error.message);
        throw error;
    }
}

module.exports = {
    getWeather,
};
