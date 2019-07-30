'use strict'

const express = require('express');
const bodyParser = require('body-parser');

let app = express();

//cargar rutas
const user_routes = require('./routes/user');
const artist_routes = require('./routes/artist');
const album_routes = require('./routes/album');
const song_routes = require('./routes/song');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar headers http   
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    response.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//rutas base
app.use('/api', [
    user_routes,
    artist_routes,
    album_routes,
    song_routes
]);


module.exports = app;