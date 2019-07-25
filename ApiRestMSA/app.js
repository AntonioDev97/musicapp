'use strict'

const express = require('express');
const bodyParser = require('body-parser');

let app = express();

//cargar rutas
const user_routes = require('./routes/user');
const artist_routes = require('./routes/artist');
const album_routes = require('./routes/album');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar headers http   

//rutas base
app.use('/api', [
    user_routes,
    artist_routes,
    album_routes
]);


module.exports = app;