const multipart = require('connect-multiparty');
const express = require('express');
const AlbumController = require('../controllers/album');

const md_upload = multipart({uploadDir: "./upload/albums"});
const md_auth = require('../middleware/authenticated');

const api = express.Router();

api.get('/getAlbum/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.get('/getAlbums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.post('/saveAlbum', md_auth.ensureAuth, AlbumController.saveAlbum);
api.put('/updateAlbum/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/deleteAlbum/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/uploadImageAlbum/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/getImageAlbum/:image', md_auth.ensureAuth, AlbumController.getImageFile);

module.exports = api;
