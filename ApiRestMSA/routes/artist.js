'use strict'

const express = require('express');
const multipart = require('connect-multiparty');
const ArtistController = require('../controllers/artist');

let api = express.Router();

let md_auth = require('../middleware/authenticated');
let md_upload = multipart({ uploadDir: "./upload/artist" });

api.get('/getArtist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/saveArtist', md_auth.ensureAuth, ArtistController.saveArtist);
api.get('/getArtists', md_auth.ensureAuth, ArtistController.getArtists);
api.put('/updateArtist/:id', md_auth.ensureAuth,ArtistController.updateArtist);
api.delete('/deleteArtist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/uploadImgArtist/:id', [md_auth.ensureAuth,md_upload], ArtistController.uploadImage);
api.get('/getImageArtist/:imageFile', ArtistController.getImageFile);

module.exports = api;