const axios = require('axios');

async function getLocationFromIP(ip) {
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        if (response.data.status === 'success') {
            return {
                lat: response.data.lat,
                lon: response.data.lon,
                city: response.data.city,
                region: response.data.regionName,
                country: response.data.country,
                timezone: response.data.timezone, // Adiciona o fuso horário
            };
        }
        return null; // Retorna null se não for possível obter a localização
    } catch (error) {
        console.error('Erro ao obter localização:', error);
        return null; // Retorna null em caso de erro
    }
}

module.exports = {
    getLocationFromIP,
};
