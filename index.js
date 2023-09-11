const express = require('express');
const cors = require('cors')
const { dbConnection } = require('./database/config');
require('dotenv').config();

console.log(process.env);

//crear el servidor de express
const app = express();

//Base de datos
dbConnection();

// cors
app.use(cors())

//directorio publico
app.use(express.static('public'));

//lectura y parseo del body
app.use(express.json());


//rutas
//TODO auth // crear,login,renueve token
app.use('/api/auth', require('./routes/auth'))

//TODO crud:eventos 
app.use('/api/events', require('./routes/events'))



//escuchar peticiones
app.listen(process.env.PORT,()=>{
    console.log(`servidor corriendo en puerto ${process.env.PORT}`);
})