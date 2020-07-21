const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
require('./config/config')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Configuración globaal de rutas
app.use(require('./routes/index'));



mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err, res) => {
    if (err) throw err;

    console.log("Conectado a la BD");
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});