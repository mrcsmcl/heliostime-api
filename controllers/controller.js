const geoService = require('../services/geoService');
const weatherService = require('../services/weatherService');
const SunCalc = require('suncalc');
const moment = require('moment-timezone');

let sunData = null;
const updateInterval = 15 * 60 * 1000; // Atualiza a cada 15 minutos

async function getSunPosition(req, res) {
    console.log('Requisição recebida:', req.method, req.url, req.headers['user-agent'], 
        req.headers['x-forwarded-for'] || req.connection.remoteAddress, new Date().toISOString());

    try {
        // Obtém o IP do jogador
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Corrige IP local ou não definido
        if (ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:' || ip === 'undefined' || ip === '::' || ip === null || ip.startsWith('::ffff:')) {
            ip = '8.8.8.8'; // Usar um IP público para testes
        }

        // Obtém localização a partir do IP
        const location = await geoService.getLocationFromIP(ip);

        if (!location) {
            return res.status(400).json({ error: 'Não foi possível determinar a localização a partir do IP.' });
        }
        else {
            console.log('Localização obtida:', location.city, ',', location.region, ',', location.country, ', IP:', ip);
        }

        const { lat, lon, timezone } = location;

        // Obtém a hora atual no fuso horário local
        const currentTime = moment.tz(timezone).toDate(); // Converte para o horário local

        // Atualiza a posição do sol se não estiver calculado ou se o intervalo de atualização tiver sido atingido
        if (!sunData || (currentTime - sunData.lastUpdate) > updateInterval) {
            sunData = SunCalc.getPosition(currentTime, lat, lon)
            sunData.lastUpdate = currentTime; // Atualiza o timestamp da última atualização
            console.log('Posição do sol atualizada:', sunData.altitude, sunData.azimuth);
        }

        // Obtém as condições climáticas da OpenWeather
        const weatherData = await weatherService.getWeather(lat, lon);

        // Obtém o fuso horário baseado na latitude e longitude
        const localTime = moment.tz(currentTime, timezone).format('YYYY-MM-DD HH:mm:ss');

        return res.json({
            ip,
            location: {
                city: location.city,
                region: location.region,
                country: location.country,
                latitude: lat,
                longitude: lon,
            },
            sun: {
                altitude: sunData.altitude,
                azimuth: sunData.azimuth,
                pitch: -(sunData.altitude * 180 / Math.PI), // Pitch (ângulo vertical) negativo da altitude
                yaw: (sunData.azimuth * 180 / Math.PI) - 90, // Yaw (ângulo horizontal) baseado no azimute
                lastUpdate: sunData.lastUpdate,
            },
            weather: {
                sky: weatherData.weather[0].description,
                temperature: weatherData.main.temp,
                temperatureCelcius: Math.round(weatherData.main.temp - 273.15),
                temperatureFahrenheit: Math.round((weatherData.main.temp - 273.15) * 9 / 5 + 32),
                humidity: weatherData.main.humidity,
                pressure: weatherData.main.pressure,
                windSpeed: weatherData.wind.speed,
                windDirection: weatherData.wind.deg,
                sunrise: new Date(weatherData.sys.sunrise * 1000),
                sunset: new Date(weatherData.sys.sunset * 1000),
            },
            time: {
                localTime,
                timezone,
            },
        });
    } catch (error) {
        console.error('Erro ao processar a requisição:', error);
        return res.status(500).json({ error: 'Erro ao processar a requisição.' });
    }
}

// Função para calcular a posição do sol
function calculateSunPosition(lat, lon, currentTime) {
    const sunPosition = SunCalc.getPosition(currentTime, lat, lon);

    // Converter radianos para graus
    const altitudeDegrees = sunPosition.altitude * (180 / Math.PI);
    const azimuthDegrees = sunPosition.azimuth * (180 / Math.PI);

    return {
        altitude: altitudeDegrees,
        azimuth: azimuthDegrees,
        lastUpdate: currentTime,
    };
}

module.exports = {
    getSunPosition,
};
