const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();

// Como un phpInfo
//console.log(process.env);

// Crear el servidor de express
const app = express();

// CORS
app.use(cors());

// Conexión a la BD
dbConnection();

// Lectura y parseo del body
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));

// Directorio público
app.use(express.static('public'));


app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});