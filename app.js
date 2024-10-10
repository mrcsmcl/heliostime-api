const express = require('express');
const controller = require('./controllers/controller');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//Hélio", que vem de "helios" (sol em grego), com "time" (tempo).
app.get('/api', controller.getSunPosition);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
