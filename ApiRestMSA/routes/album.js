const express = require('express');
const AlbumController = require('../controllers/album');

const api = express.Router();

api.get('/getAlbum/:id', AlbumController.getAlbum);
api.get('/getAlbums/:artist?', AlbumController.getAlbums);
api.post('/saveAlbum', AlbumController.saveAlbum);

module.exports = api;
