const mongoose  = require("mongoose");


const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.DB_CONN, {
            
            useUnifiedTopology: true,
            
        });
        console.log('BD conectada!');

    } catch (error) {
        console.error(error);
        throw new Error('Error al inicializar la BD');

    }
};

module.exports = {dbConnection};